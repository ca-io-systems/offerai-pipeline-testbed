import { db } from '@/db'
import { listings } from '@/db/schema'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const allListings = await db.select().from(listings)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">
        Explore stays
      </h1>

      {allListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#767676] mb-4">No listings available yet.</p>
          <p className="text-sm text-[#767676]">
            Run <code className="bg-[#F7F7F7] px-2 py-1 rounded">bun run db:seed</code> to add sample data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allListings.map(listing => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group"
            >
              <div className="aspect-square relative rounded-xl overflow-hidden mb-3">
                <Image
                  src={listing.imageUrl || 'https://picsum.photos/seed/default/400/400'}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-[#484848] truncate">
                {listing.title}
              </h3>
              <p className="text-[#767676] text-sm truncate">
                {listing.location}
              </p>
              <p className="mt-1">
                <span className="font-semibold">${listing.basePrice}</span>
                <span className="text-[#767676]"> night</span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
