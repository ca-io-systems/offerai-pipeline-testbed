import { db } from '@/db'
import { listings } from '@/db/schema'
import Link from 'next/link'

export default async function HomePage() {
  const allListings = await db.select().from(listings)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">Places to stay</h1>
      
      {allListings.length === 0 ? (
        <p className="text-[#767676]">No listings available. Run `bun run db:seed` to add sample data.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F7F7] mb-3">
                {listing.imageUrl && (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#484848]">{listing.title}</h3>
                  <p className="text-[#767676]">{listing.location}</p>
                </div>
                <p className="text-[#484848]">
                  <span className="font-semibold">${listing.pricePerNight}</span> / night
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
