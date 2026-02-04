import { db } from '@/db'
import { listings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

export default async function HostCalendarIndexPage() {
  // For demo purposes, get the first host's listings
  const host = await db.query.users.findFirst()
  
  if (!host) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#484848] mb-4">Host Dashboard</h1>
        <p className="text-[#767676]">No users found. Run <code className="bg-[#F7F7F7] px-2 py-1 rounded">bun run db:seed</code> to add sample data.</p>
      </div>
    )
  }

  const hostListings = await db.query.listings.findMany({
    where: eq(listings.hostId, host.id),
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#484848] mb-6">Host Dashboard</h1>
      
      <h2 className="text-lg font-semibold text-[#484848] mb-4">Your Listings</h2>
      
      {hostListings.length === 0 ? (
        <p className="text-[#767676]">You don&apos;t have any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostListings.map(listing => (
            <Link
              key={listing.id}
              href={`/host/calendar/${listing.id}`}
              className="border border-[#EBEBEB] rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-[#484848] mb-1">{listing.title}</h3>
              <p className="text-sm text-[#767676] mb-2">{listing.location}</p>
              <p className="text-sm">
                <span className="font-semibold">${listing.basePrice}</span>
                <span className="text-[#767676]"> / night</span>
              </p>
              <p className="text-sm text-[#FF5A5F] mt-2">
                Manage pricing →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
