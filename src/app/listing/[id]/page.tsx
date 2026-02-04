import { notFound } from 'next/navigation'
import { getListing, getBlockedDates } from '@/actions/booking'
import BookingCard from '@/components/BookingCard'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const listingId = parseInt(id, 10)
  
  if (isNaN(listingId)) {
    notFound()
  }

  const listing = await getListing(listingId)
  
  if (!listing) {
    notFound()
  }

  const blockedDates = await getBlockedDates(listingId)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Listing Details */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="aspect-video rounded-xl overflow-hidden bg-[#F7F7F7] mb-6">
            {listing.imageUrl && (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Title and Location */}
          <h1 className="text-2xl font-bold text-[#484848] mb-2">{listing.title}</h1>
          <p className="text-[#767676] mb-6">{listing.location}</p>

          {/* Host */}
          <div className="border-b border-[#EBEBEB] pb-6 mb-6">
            <p className="text-[#484848]">
              Hosted by <span className="font-semibold">{listing.hostName}</span>
            </p>
            <p className="text-[#767676]">
              {listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''} maximum
              {listing.minNights > 1 && ` · ${listing.minNights} night minimum`}
            </p>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#484848] mb-4">About this place</h2>
              <p className="text-[#484848] whitespace-pre-line">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <BookingCard
              listingId={listing.id}
              pricePerNight={listing.pricePerNight}
              cleaningFee={listing.cleaningFee}
              maxGuests={listing.maxGuests}
              minNights={listing.minNights}
              blockedDates={blockedDates}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
