import Link from 'next/link'
import { db } from '@/db'
import { listings } from '@/db/schema'

export default async function HomePage() {
  const allListings = await db.select().from(listings)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">OfferBnb</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="block rounded-xl overflow-hidden border border-[#EBEBEB] hover:shadow-lg transition-shadow"
          >
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-[#484848]">{listing.title}</h2>
              <p className="text-[#767676] text-sm">{listing.city}, {listing.country}</p>
              <p className="mt-2">
                <span className="font-semibold">${listing.pricePerNight}</span>
                <span className="text-[#767676]"> night</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
