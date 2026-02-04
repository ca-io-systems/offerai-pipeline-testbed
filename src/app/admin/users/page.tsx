import { db } from '@/db'
import { users, listings, bookings } from '@/db/schema'
import { eq, like, sql, count } from 'drizzle-orm'
import { UsersTable } from '@/components/admin/UsersTable'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getUsers(search?: string) {
  const conditions = []

  if (search) {
    conditions.push(
      sql`(${users.name} LIKE ${'%' + search + '%'} OR ${users.email} LIKE ${'%' + search + '%'})`
    )
  }

  const usersData = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      isAdmin: users.isAdmin,
      isSuspended: users.isSuspended,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(sql`${users.createdAt} DESC`)

  // Get listing and booking counts for each user
  const usersWithCounts = await Promise.all(
    usersData.map(async (user) => {
      const [listingsCount] = await db
        .select({ count: count() })
        .from(listings)
        .where(eq(listings.hostId, user.id))

      const [bookingsCount] = await db
        .select({ count: count() })
        .from(bookings)
        .where(eq(bookings.guestId, user.id))

      return {
        ...user,
        listingsCount: listingsCount.count,
        bookingsCount: bookingsCount.count,
      }
    })
  )

  return usersWithCounts
}

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined

  const usersData = await getUsers(search)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#484848]">User Management</h1>
        <p className="text-[#767676] mt-1">Manage users and their roles</p>
      </div>

      <UsersTable users={usersData} initialSearch={search} />
    </div>
  )
}
