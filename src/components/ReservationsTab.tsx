'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ReservationWithDetails, ReservationFilter, updateReservationStatus } from '@/actions/reservations'

type Props = {
  initialReservations: ReservationWithDetails[]
}

function StatusBadge({ status }: { status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }) {
  const colors = {
    pending: 'bg-[#FFB400] text-white',
    confirmed: 'bg-[#008A05] text-white',
    cancelled: 'bg-[#C13515] text-white',
    completed: 'bg-[#767676] text-white',
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${colors[status]}`}>
      {status}
    </span>
  )
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ReservationRow({
  reservation,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  reservation: ReservationWithDetails
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (id: string, status: 'confirmed' | 'cancelled') => void
}) {
  return (
    <>
      <tr
        className="border-b border-[#EBEBEB] hover:bg-[#F7F7F7] cursor-pointer"
        onClick={onToggle}
      >
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={reservation.guestAvatar || 'https://picsum.photos/100/100'}
                alt={reservation.guestName}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{reservation.guestName}</span>
          </div>
        </td>
        <td className="py-4 px-4">{reservation.listingTitle}</td>
        <td className="py-4 px-4">{formatDate(reservation.checkIn)}</td>
        <td className="py-4 px-4">{formatDate(reservation.checkOut)}</td>
        <td className="py-4 px-4 text-center">{reservation.guestsCount}</td>
        <td className="py-4 px-4 font-medium">${reservation.hostPayout.toFixed(2)}</td>
        <td className="py-4 px-4">
          <StatusBadge status={reservation.status} />
        </td>
        <td className="py-4 px-4 text-[#767676]">
          {isExpanded ? '▲' : '▼'}
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="bg-[#F7F7F7]">
          <td colSpan={8} className="py-4 px-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <p className="text-sm text-[#767676]">
                  Booking ID: {reservation.id}
                </p>
                <p className="text-sm text-[#767676]">
                  Total Price: ${reservation.totalPrice.toFixed(2)}
                </p>
              </div>
              
              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onStatusChange(reservation.id, 'confirmed')
                      }}
                      className="px-4 py-2 bg-[#008A05] text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onStatusChange(reservation.id, 'cancelled')
                      }}
                      className="px-4 py-2 bg-[#C13515] text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 border border-[#EBEBEB] text-sm rounded hover:bg-white transition-colors"
                >
                  Message guest
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const FILTERS: { value: ReservationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'current', label: 'Current' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function ReservationsTab({ initialReservations }: Props) {
  const [reservations, setReservations] = useState(initialReservations)
  const [filter, setFilter] = useState<ReservationFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const filteredReservations = reservations.filter(r => {
    const now = new Date()
    const checkIn = new Date(r.checkIn)
    const checkOut = new Date(r.checkOut)
    
    switch (filter) {
      case 'upcoming':
        return checkIn > now && r.status !== 'cancelled'
      case 'current':
        return checkIn <= now && checkOut >= now && r.status !== 'cancelled'
      case 'past':
        return checkOut < now && r.status !== 'cancelled'
      case 'cancelled':
        return r.status === 'cancelled'
      default:
        return true
    }
  })
  
  const handleStatusChange = useCallback(async (id: string, status: 'confirmed' | 'cancelled') => {
    await updateReservationStatus(id, status)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }, [])
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reservations</h2>
      
      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === f.value
                ? 'bg-[#FF5A5F] text-white'
                : 'bg-white border border-[#EBEBEB] hover:bg-[#F7F7F7]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 text-[#767676]">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F7F7F7] text-left text-sm text-[#767676]">
              <tr>
                <th className="py-3 px-4 font-medium">Guest</th>
                <th className="py-3 px-4 font-medium">Listing</th>
                <th className="py-3 px-4 font-medium">Check-in</th>
                <th className="py-3 px-4 font-medium">Check-out</th>
                <th className="py-3 px-4 font-medium text-center">Guests</th>
                <th className="py-3 px-4 font-medium">Payout</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <ReservationRow
                  key={reservation.id}
                  reservation={reservation}
                  isExpanded={expandedId === reservation.id}
                  onToggle={() => setExpandedId(expandedId === reservation.id ? null : reservation.id)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
