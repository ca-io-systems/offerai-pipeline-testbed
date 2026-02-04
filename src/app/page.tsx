import { db } from '@/db'
import { listings } from '@/db/schema'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const allListings = await db.select().from(listings)

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-semibold">Explore places to stay</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="group"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={`https://picsum.photos/seed/listing${listing.id}-1/800/600`}
                alt={listing.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{listing.location}</h3>
                <div className="flex items-center gap-1">
                  <span>★</span>
                  <span>{listing.avgRating.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-[#767676]">{listing.propertyType}</p>
              <p className="mt-1">
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
