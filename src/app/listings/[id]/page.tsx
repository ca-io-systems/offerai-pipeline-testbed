import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { listings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = Promise<{ id: string }>

export default async function ListingPage({ params }: { params: Params }) {
  const { id } = await params
  
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
  })

  if (!listing) {
    notFound()
  }

  const host = await db.query.users.findFirst({
    where: eq(users.id, listing.hostId),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="text-[#FF5A5F] hover:underline mb-4 inline-block">
        ← Back to listings
      </Link>
      
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-[#484848]">{listing.title}</h1>
        <div className="flex items-center gap-2 text-sm text-[#767676] mt-1">
          {listing.rating && (
            <>
              <span className="text-[#484848]">★ {listing.rating}</span>
              <span>·</span>
              <span>{listing.reviewCount} reviews</span>
              <span>·</span>
            </>
          )}
          <span>{listing.city}, {listing.country}</span>
        </div>
      </div>

      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-full h-96 object-cover rounded-xl mt-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 pb-6 border-b border-[#EBEBEB]">
            <div>
              <h2 className="text-xl font-semibold text-[#484848]">
                {listing.propertyType} hosted by {host?.name}
              </h2>
              <p className="text-[#767676]">
                {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} bath
              </p>
            </div>
            {host?.avatarUrl && (
              <img
                src={host.avatarUrl}
                alt={host.name}
                className="w-14 h-14 rounded-full ml-auto"
              />
            )}
          </div>

          <div className="py-6 border-b border-[#EBEBEB]">
            <h3 className="text-lg font-semibold text-[#484848] mb-4">About this place</h3>
            <p className="text-[#484848]">{listing.description}</p>
          </div>

          {listing.houseRules && (
            <div className="py-6 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-semibold text-[#484848] mb-4">House rules</h3>
              <ul className="space-y-2">
                {listing.houseRules.split(',').map((rule, i) => (
                  <li key={i} className="text-[#484848]">{rule.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-[#EBEBEB] rounded-xl p-6 shadow-lg sticky top-8">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-semibold">${listing.pricePerNight}</span>
              <span className="text-[#767676]">night</span>
            </div>

            <Link
              href={`/checkout/${listing.id}?checkIn=2025-03-01&checkOut=2025-03-05&guests=2`}
              className="block w-full bg-[#FF5A5F] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#E04E52] transition-colors"
            >
              Reserve
            </Link>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#484848] underline">${listing.pricePerNight} x 4 nights</span>
                <span>${listing.pricePerNight * 4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#484848] underline">Cleaning fee</span>
                <span>${listing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#484848] underline">OfferBnb service fee</span>
                <span>${listing.serviceFee}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-[#EBEBEB] font-semibold">
                <span>Total</span>
                <span>${listing.pricePerNight * 4 + listing.cleaningFee + listing.serviceFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
