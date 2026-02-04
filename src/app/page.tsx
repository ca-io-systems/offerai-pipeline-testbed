import { db } from '@/db'
import { listings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const allListings = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      image: listings.image,
      price: listings.price,
      hostName: users.name,
    })
    .from(listings)
    .innerJoin(users, eq(listings.hostId, users.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">Find your next stay</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-[#484848] truncate">{listing.title}</h2>
              <p className="text-[#767676] text-sm">Hosted by {listing.hostName}</p>
              <p className="mt-2">
                <span className="font-semibold text-[#484848]">${listing.price}</span>
                <span className="text-[#767676]"> / night</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
