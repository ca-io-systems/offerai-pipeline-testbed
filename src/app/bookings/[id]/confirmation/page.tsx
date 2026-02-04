import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { bookings, listings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'
import { formatDate, formatCurrency } from '@/lib/utils'
import { SuccessCheckmark } from '@/components/SuccessCheckmark'

type Params = Promise<{ id: string }>

export default async function ConfirmationPage({ params }: { params: Params }) {
  const user = await requireAuth()
  const { id } = await params

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
  })

  if (!booking || booking.guestId !== user.id) {
    notFound()
  }

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, booking.listingId),
  })

  if (!listing) {
    notFound()
  }

  const host = await db.query.users.findFirst({
    where: eq(users.id, listing.hostId),
  })

  const calendarUrl = `/api/calendar?title=${encodeURIComponent(`OfferBnb: ${listing.title}`)}&startDate=${booking.checkIn}&endDate=${booking.checkOut}&location=${encodeURIComponent(`${listing.address}, ${listing.city}, ${listing.country}`)}&description=${encodeURIComponent(`Your stay at ${listing.title}. Confirmation: ${booking.referenceNumber}`)}`

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#EBEBEB]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <SuccessCheckmark />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#484848] mb-2">
            Your trip is booked!
          </h1>
          <p className="text-[#767676]">
            Confirmation number: <span className="font-medium text-[#484848]">{booking.referenceNumber}</span>
          </p>
        </div>

        <div className="border border-[#EBEBEB] rounded-xl overflow-hidden mb-8">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#484848] mb-2">{listing.title}</h2>
            <p className="text-[#767676] mb-4">{listing.address}, {listing.city}, {listing.country}</p>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#EBEBEB]">
              <div>
                <p className="text-sm text-[#767676]">Check-in</p>
                <p className="font-medium text-[#484848]">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-sm text-[#767676]">Check-out</p>
                <p className="font-medium text-[#484848]">{formatDate(booking.checkOut)}</p>
              </div>
            </div>

            <div className="py-4 border-t border-[#EBEBEB]">
              <div className="flex justify-between">
                <span className="text-[#767676]">Guests</span>
                <span className="text-[#484848]">{booking.guests}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#767676]">Total paid</span>
                <span className="font-semibold text-[#484848]">{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {host && (
          <div className="border border-[#EBEBEB] rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-[#484848] mb-4">Your host</h3>
            <div className="flex items-center gap-4">
              {host.avatarUrl && (
                <img
                  src={host.avatarUrl}
                  alt={host.name}
                  className="w-14 h-14 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-[#484848]">{host.name}</p>
                <p className="text-sm text-[#767676]">Host</p>
              </div>
              <button className="px-6 py-2 border border-[#484848] rounded-lg font-medium text-[#484848] hover:bg-gray-50 transition-colors">
                Message host
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={calendarUrl}
            download="offerbnb-booking.ics"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#484848] rounded-lg font-medium text-[#484848] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to calendar
          </a>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-[#FF5A5F] text-white rounded-lg font-medium hover:bg-[#E04E52] transition-colors"
          >
            View trip details
          </Link>
        </div>
      </main>
    </div>
  )
}
