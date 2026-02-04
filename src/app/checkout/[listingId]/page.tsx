import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { listings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'
import { formatDateShort, calculateNights, formatCurrency } from '@/lib/utils'
import { PaymentForm } from '@/components/PaymentForm'
import { ListingMiniCard } from '@/components/ListingMiniCard'
import { PriceBreakdown } from '@/components/PriceBreakdown'

type Params = Promise<{ listingId: string }>
type SearchParams = Promise<{ checkIn?: string; checkOut?: string; guests?: string }>

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const user = await requireAuth()
  const { listingId } = await params
  const { checkIn, checkOut, guests: guestsParam } = await searchParams

  if (!checkIn || !checkOut) {
    redirect(`/listings/${listingId}`)
  }

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    notFound()
  }

  const guests = parseInt(guestsParam || '1', 10)
  const nights = calculateNights(checkIn, checkOut)
  const accommodationTotal = listing.pricePerNight * nights
  const total = accommodationTotal + listing.cleaningFee + listing.serviceFee

  const cancellationPolicies: Record<string, string> = {
    flexible: 'Free cancellation for 48 hours. After that, cancel before check-in and get a full refund, minus the service fee.',
    moderate: 'Free cancellation until 5 days before check-in. After that, cancel before check-in and get a 50% refund, minus the service fee.',
    strict: 'Cancel within 48 hours of booking and get a full refund. After that, if you cancel at least 7 days before check-in, you get a 50% refund.',
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#EBEBEB]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href={`/listings/${listingId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
          className="inline-flex items-center gap-2 text-[#484848] hover:underline mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Request to book
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-2xl font-semibold text-[#484848] mb-8">Request to book</h1>

            <div className="border-b border-[#EBEBEB] pb-8 mb-8">
              <h2 className="text-xl font-semibold text-[#484848] mb-6">Your trip</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#484848]">Dates</h3>
                    <p className="text-[#767676]">
                      {formatDateShort(checkIn)} – {formatDateShort(checkOut)}
                    </p>
                  </div>
                  <Link
                    href={`/listings/${listingId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="text-[#484848] underline font-medium"
                  >
                    Edit
                  </Link>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#484848]">Guests</h3>
                    <p className="text-[#767676]">{guests} guest{guests !== 1 ? 's' : ''}</p>
                  </div>
                  <Link
                    href={`/listings/${listingId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="text-[#484848] underline font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-b border-[#EBEBEB] pb-8 mb-8">
              <h2 className="text-xl font-semibold text-[#484848] mb-4">Cancellation policy</h2>
              <p className="text-[#484848]">
                <span className="font-medium capitalize">{listing.cancellationPolicy}:</span>{' '}
                {cancellationPolicies[listing.cancellationPolicy] || cancellationPolicies.moderate}
              </p>
            </div>

            <PaymentForm
              listingId={listingId}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              houseRules={listing.houseRules}
            />
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="border border-[#EBEBEB] rounded-xl p-6">
              <ListingMiniCard listing={listing} />
              
              <div className="mt-6 pt-6 border-t border-[#EBEBEB]">
                <PriceBreakdown
                  pricePerNight={listing.pricePerNight}
                  nights={nights}
                  cleaningFee={listing.cleaningFee}
                  serviceFee={listing.serviceFee}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
