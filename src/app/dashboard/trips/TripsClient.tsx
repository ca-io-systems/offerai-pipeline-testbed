'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import TripCard, { type TripData } from '@/components/TripCard'
import CancellationModal from '@/components/CancellationModal'
import { cancelBooking } from '@/actions/bookings'

type Tab = 'upcoming' | 'past' | 'cancelled'

type TripsData = {
  upcoming: (TripData & { cancellationPolicy: string })[]
  past: (TripData & { cancellationPolicy: string })[]
  cancelled: (TripData & { cancellationPolicy: string })[]
}

type TripsClientProps = {
  trips: TripsData
}

export default function TripsClient({ trips: initialTrips }: TripsClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [trips, setTrips] = useState(initialTrips)
  const [cancellingTrip, setCancellingTrip] = useState<(TripData & { cancellationPolicy: string }) | null>(null)

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'upcoming', label: 'Upcoming', count: trips.upcoming.length },
    { id: 'past', label: 'Past', count: trips.past.length },
    { id: 'cancelled', label: 'Cancelled', count: trips.cancelled.length },
  ]

  const handleCancelClick = useCallback((tripId: number) => {
    const trip = trips.upcoming.find(t => t.id === tripId)
    if (trip) {
      setCancellingTrip(trip)
    }
  }, [trips.upcoming])

  const handleConfirmCancel = useCallback(async (reason: string) => {
    if (!cancellingTrip) return

    const result = await cancelBooking(cancellingTrip.id, reason)
    
    if (result.success) {
      // Move the trip from upcoming to cancelled
      const updatedTrip = {
        ...cancellingTrip,
        status: 'cancelled',
        cancellationReason: reason,
        cancellationDate: new Date().toISOString().split('T')[0],
      }
      
      setTrips(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(t => t.id !== cancellingTrip.id),
        cancelled: [updatedTrip, ...prev.cancelled],
      }))
      
      setCancellingTrip(null)
      router.refresh()
    } else {
      alert(result.error || 'Failed to cancel booking')
    }
  }, [cancellingTrip, router])

  const currentTrips = trips[activeTab]

  return (
    <>
      <div className="border-b border-[#EBEBEB] mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#484848] text-[#484848]'
                  : 'border-transparent text-[#767676] hover:text-[#484848]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {currentTrips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#767676] text-lg">
            {activeTab === 'upcoming' && 'No upcoming trips. Time to plan your next adventure!'}
            {activeTab === 'past' && 'No past trips yet.'}
            {activeTab === 'cancelled' && 'No cancelled bookings.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              variant={activeTab}
              onCancel={activeTab === 'upcoming' ? handleCancelClick : undefined}
            />
          ))}
        </div>
      )}

      {cancellingTrip && (
        <CancellationModal
          isOpen={true}
          onClose={() => setCancellingTrip(null)}
          onConfirm={handleConfirmCancel}
          tripTitle={cancellingTrip.listing.title}
          checkInDate={cancellingTrip.checkIn}
          totalPrice={cancellingTrip.totalPrice}
          cancellationPolicy={cancellingTrip.cancellationPolicy}
        />
      )}
    </>
  )
}
