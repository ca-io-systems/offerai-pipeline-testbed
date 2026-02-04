import { notFound, redirect } from 'next/navigation'
import { getListing, calculatePrice, checkAvailability } from '@/actions/booking'
import PriceBreakdown from '@/components/PriceBreakdown'

interface CheckoutPageProps {
  params: Promise<{ listingId: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { listingId } = await params
  const { checkIn, checkOut, guests } = await searchParams
  
  const id = parseInt(listingId, 10)
  
  if (isNaN(id)) {
    notFound()
  }

  if (!checkIn || !checkOut || !guests) {
    redirect(`/listing/${listingId}`)
  }

  const listing = await getListing(id)
  
  if (!listing) {
    notFound()
  }

  const guestCount = parseInt(guests, 10)
  if (isNaN(guestCount) || guestCount < 1 || guestCount > listing.maxGuests) {
    redirect(`/listing/${listingId}`)
  }

  // Verify availability one more time
  const availability = await checkAvailability(id, checkIn, checkOut)
  if (!availability.available) {
    redirect(`/listing/${listingId}`)
  }

  const priceBreakdown = await calculatePrice(id, checkIn, checkOut)
  if (!priceBreakdown) {
    redirect(`/listing/${listingId}`)
  }

  const checkInDate = new Date(checkIn + 'T00:00:00')
  const checkOutDate = new Date(checkOut + 'T00:00:00')

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#484848] mb-8">Confirm and pay</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trip Details */}
        <div>
          <h2 className="text-xl font-semibold text-[#484848] mb-4">Your trip</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-[#484848]">Dates</h3>
            <p className="text-[#767676]">
              {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' – '}
              {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-[#484848]">Guests</h3>
            <p className="text-[#767676]">{guestCount} guest{guestCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Listing Summary */}
        <div className="border border-[#EBEBEB] rounded-xl p-4">
          <div className="flex gap-4 mb-4 pb-4 border-b border-[#EBEBEB]">
            {listing.imageUrl && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-[#484848]">{listing.title}</h3>
              <p className="text-sm text-[#767676]">{listing.location}</p>
            </div>
          </div>

          <PriceBreakdown breakdown={priceBreakdown} />
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-8 pt-8 border-t border-[#EBEBEB]">
        <button
          type="button"
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm and pay · ${priceBreakdown.total.toFixed(2)}
        </button>
        <p className="text-sm text-[#767676] mt-3">
          By selecting the button, you agree to the House Rules, Safety disclosures, and Cancellation Policy.
        </p>
      </div>
    </div>
  )
}
