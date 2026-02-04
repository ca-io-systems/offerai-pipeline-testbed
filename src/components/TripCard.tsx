import Image from 'next/image'
import Link from 'next/link'
import StatusBadge from './StatusBadge'
import { formatDateRange, getDaysUntil, formatCountdown } from '@/lib/utils'

export type TripData = {
  id: number
  checkIn: string
  checkOut: string
  totalPrice: number
  status: string
  cancellationReason: string | null
  cancellationDate: string | null
  refundAmount: number | null
  listing: {
    id: number
    title: string
    city: string
    image: string
  }
  host: {
    id: number
    name: string
    avatar: string | null
  }
  hasReview: boolean
}

type TripCardProps = {
  trip: TripData
  variant: 'upcoming' | 'past' | 'cancelled'
  onCancel?: (tripId: number) => void
}

export default function TripCard({ trip, variant, onCancel }: TripCardProps) {
  const daysUntil = getDaysUntil(trip.checkIn)
  
  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={trip.listing.image}
          alt={trip.listing.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={trip.status} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#484848] mb-1">
          {trip.listing.title}
        </h3>
        <p className="text-[#767676] text-sm mb-2">{trip.listing.city}</p>
        <p className="text-[#484848] font-medium mb-3">
          {formatDateRange(trip.checkIn, trip.checkOut)}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          {trip.host.avatar && (
            <Image
              src={trip.host.avatar}
              alt={trip.host.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-[#767676]">Hosted by {trip.host.name}</span>
        </div>
        
        {variant === 'upcoming' && (
          <>
            <p className="text-sm text-[#FF5A5F] font-medium mb-4">
              {formatCountdown(daysUntil)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/bookings/${trip.id}`}
                className="px-4 py-2 bg-[#FF5A5F] text-white rounded-lg text-sm font-medium hover:bg-[#E04E52] transition-colors"
              >
                View details
              </Link>
              <button className="px-4 py-2 border border-[#484848] text-[#484848] rounded-lg text-sm font-medium hover:bg-[#F7F7F7] transition-colors">
                Message host
              </button>
              {onCancel && (
                <button
                  onClick={() => onCancel(trip.id)}
                  className="px-4 py-2 border border-[#C13515] text-[#C13515] rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </>
        )}
        
        {variant === 'past' && (
          <div className="flex flex-wrap gap-2">
            {!trip.hasReview && (
              <Link
                href={`/bookings/${trip.id}/review`}
                className="px-4 py-2 bg-[#FF5A5F] text-white rounded-lg text-sm font-medium hover:bg-[#E04E52] transition-colors"
              >
                Write a review
              </Link>
            )}
            <Link
              href={`/listings/${trip.listing.id}`}
              className="px-4 py-2 border border-[#484848] text-[#484848] rounded-lg text-sm font-medium hover:bg-[#F7F7F7] transition-colors"
            >
              Book again
            </Link>
          </div>
        )}
        
        {variant === 'cancelled' && (
          <div className="space-y-2 text-sm">
            {trip.cancellationDate && (
              <p className="text-[#767676]">
                Cancelled on {new Date(trip.cancellationDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
            {trip.refundAmount !== null && (
              <p className="text-[#008A05] font-medium">
                Refund: ${trip.refundAmount.toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
