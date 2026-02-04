import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBookingDetails } from '@/actions/bookings'
import StatusBadge from '@/components/StatusBadge'
import { formatDateRange, getCancellationPolicyDetails } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params
  const bookingId = parseInt(id, 10)
  
  if (isNaN(bookingId)) {
    notFound()
  }

  const booking = await getBookingDetails(bookingId)

  if (!booking) {
    notFound()
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/dashboard/trips"
        className="inline-flex items-center text-[#767676] hover:text-[#484848] mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to trips
      </Link>

      <div className="bg-white rounded-lg border border-[#EBEBEB] overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src={booking.listing.image}
            alt={booking.listing.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#484848] mb-1">
                {booking.listing.title}
              </h1>
              <p className="text-[#767676]">{booking.listing.city}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#F7F7F7] rounded-lg p-4">
              <h2 className="font-semibold text-[#484848] mb-3">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#767676]">Dates</span>
                  <span className="text-[#484848] font-medium">
                    {formatDateRange(booking.checkIn, booking.checkOut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767676]">Nights</span>
                  <span className="text-[#484848]">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767676]">Price per night</span>
                  <span className="text-[#484848]">${booking.listing.pricePerNight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-[#EBEBEB] pt-2 mt-2">
                  <span className="font-medium text-[#484848]">Total</span>
                  <span className="font-medium text-[#484848]">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F7F7F7] rounded-lg p-4">
              <h2 className="font-semibold text-[#484848] mb-3">Host</h2>
              <div className="flex items-center gap-3 mb-3">
                {booking.host.avatar && (
                  <Image
                    src={booking.host.avatar}
                    alt={booking.host.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-[#484848]">{booking.host.name}</p>
                  <p className="text-sm text-[#767676]">{booking.host.email}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border border-[#484848] text-[#484848] rounded-lg text-sm font-medium hover:bg-white transition-colors">
                Message host
              </button>
            </div>
          </div>

          {booking.listing.checkInInstructions && (
            <div className="mb-6">
              <h2 className="font-semibold text-[#484848] mb-2">Check-in Instructions</h2>
              <p className="text-[#767676] text-sm bg-[#F7F7F7] rounded-lg p-4">
                {booking.listing.checkInInstructions}
              </p>
            </div>
          )}

          {booking.listing.houseRules && (
            <div className="mb-6">
              <h2 className="font-semibold text-[#484848] mb-2">House Rules</h2>
              <p className="text-[#767676] text-sm bg-[#F7F7F7] rounded-lg p-4">
                {booking.listing.houseRules}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold text-[#484848] mb-2">Location</h2>
            <p className="text-[#767676] text-sm mb-3">{booking.listing.address}</p>
            {booking.listing.latitude && booking.listing.longitude && (
              <div className="bg-[#F7F7F7] rounded-lg p-4 text-center">
                <p className="text-sm text-[#767676]">
                  Map coordinates: {booking.listing.latitude.toFixed(4)}, {booking.listing.longitude.toFixed(4)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${booking.listing.latitude},${booking.listing.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[#FF5A5F] text-sm font-medium hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-[#EBEBEB] pt-6">
            <h2 className="font-semibold text-[#484848] mb-2">Cancellation Policy</h2>
            <p className="text-[#767676] text-sm">
              <span className="font-medium capitalize">{booking.listing.cancellationPolicy}</span>:{' '}
              {getCancellationPolicyDetails(booking.listing.cancellationPolicy)}
            </p>
          </div>

          {booking.status === 'cancelled' && (
            <div className="border-t border-[#EBEBEB] pt-6 mt-6">
              <h2 className="font-semibold text-[#C13515] mb-2">Cancellation Details</h2>
              <div className="space-y-1 text-sm">
                {booking.cancellationDate && (
                  <p className="text-[#767676]">
                    Cancelled on{' '}
                    {new Date(booking.cancellationDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {booking.cancellationReason && (
                  <p className="text-[#767676]">Reason: {booking.cancellationReason}</p>
                )}
                {booking.refundAmount !== null && (
                  <p className="text-[#008A05] font-medium">
                    Refund: ${booking.refundAmount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
