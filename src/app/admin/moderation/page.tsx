import { db } from '@/db'
import { listings, users } from '@/db/schema'
import { eq, or, sql } from 'drizzle-orm'
import { ModerationQueue } from '@/components/admin/ModerationQueue'

async function getPendingListings() {
  const pendingListings = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      city: listings.city,
      address: listings.address,
      price: listings.price,
      imageUrl: listings.imageUrl,
      status: listings.status,
      isFlagged: listings.isFlagged,
      createdAt: listings.createdAt,
      hostId: listings.hostId,
      hostName: users.name,
      hostEmail: users.email,
    })
    .from(listings)
    .leftJoin(users, eq(listings.hostId, users.id))
    .where(or(eq(listings.status, 'pending'), eq(listings.isFlagged, true)))
    .orderBy(sql`${listings.createdAt} DESC`)

  return pendingListings
}

export default async function ModerationPage() {
  const pendingListings = await getPendingListings()

  const pendingCount = pendingListings.filter(l => l.status === 'pending').length
  const flaggedCount = pendingListings.filter(l => l.isFlagged).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#484848]">Content Moderation Queue</h1>
        <p className="text-[#767676] mt-1">Review new listings before they go live and flagged content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#767676]">Pending Review</p>
              <p className="text-2xl font-bold text-[#FFB400]">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFB400]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#FFB400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#767676]">Flagged for Review</p>
              <p className="text-2xl font-bold text-[#C13515]">{flaggedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#C13515]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C13515]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <ModerationQueue listings={pendingListings} />
    </div>
  )
}
