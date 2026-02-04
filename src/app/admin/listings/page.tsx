import { db } from '@/db'
import { listings, users, reports } from '@/db/schema'
import { eq, like, sql, count } from 'drizzle-orm'
import { ListingsTable } from '@/components/admin/ListingsTable'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getListings(search?: string, status?: string, city?: string) {
  const conditions = []

  if (search) {
    conditions.push(like(listings.title, `%${search}%`))
  }

  if (status && status !== 'all') {
    conditions.push(eq(listings.status, status as 'pending' | 'approved' | 'suspended'))
  }

  if (city && city !== 'all') {
    conditions.push(eq(listings.city, city))
  }

  const listingsData = await db
    .select({
      id: listings.id,
      title: listings.title,
      city: listings.city,
      price: listings.price,
      status: listings.status,
      rating: listings.rating,
      isFlagged: listings.isFlagged,
      imageUrl: listings.imageUrl,
      description: listings.description,
      address: listings.address,
      createdAt: listings.createdAt,
      hostId: listings.hostId,
      hostName: users.name,
      hostEmail: users.email,
    })
    .from(listings)
    .leftJoin(users, eq(listings.hostId, users.id))
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(sql`${listings.createdAt} DESC`)

  // Get report counts for each listing
  const listingsWithReports = await Promise.all(
    listingsData.map(async (listing) => {
      const [reportCount] = await db
        .select({ count: count() })
        .from(reports)
        .where(eq(reports.listingId, listing.id))

      return {
        ...listing,
        reportsCount: reportCount.count,
      }
    })
  )

  return listingsWithReports
}

async function getCities() {
  const cities = await db
    .selectDistinct({ city: listings.city })
    .from(listings)

  return cities.map(c => c.city)
}

export default async function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const status = typeof params.status === 'string' ? params.status : undefined
  const city = typeof params.city === 'string' ? params.city : undefined

  const listingsData = await getListings(search, status, city)
  const cities = await getCities()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#484848]">Listings Moderation</h1>
        <p className="text-[#767676] mt-1">Manage and moderate all listings on the platform</p>
      </div>

      <ListingsTable
        listings={listingsData}
        cities={cities}
        initialSearch={search}
        initialStatus={status}
        initialCity={city}
      />
    </div>
  )
}
