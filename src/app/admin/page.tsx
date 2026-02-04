import { db } from '@/db'
import { users, listings, bookings } from '@/db/schema'
import { count, sum, sql, gte, and, eq } from 'drizzle-orm'
import { StatCard } from '@/components/StatCard'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { PieChart } from '@/components/charts/PieChart'

async function getStats() {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // Total users
  const [totalUsersResult] = await db.select({ count: count() }).from(users)
  const [lastMonthUsersResult] = await db
    .select({ count: count() })
    .from(users)
    .where(sql`${users.createdAt} < ${thisMonthStart.getTime()}`)

  // Total listings
  const [totalListingsResult] = await db.select({ count: count() }).from(listings)
  const [lastMonthListingsResult] = await db
    .select({ count: count() })
    .from(listings)
    .where(sql`${listings.createdAt} < ${thisMonthStart.getTime()}`)

  // Active bookings (confirmed or pending)
  const [activeBookingsResult] = await db
    .select({ count: count() })
    .from(bookings)
    .where(sql`${bookings.status} IN ('confirmed', 'pending')`)
  const [lastMonthActiveBookingsResult] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        sql`${bookings.status} IN ('confirmed', 'pending')`,
        sql`${bookings.createdAt} < ${thisMonthStart.getTime()}`
      )
    )

  // Total revenue (from completed bookings)
  const [revenueResult] = await db
    .select({ total: sum(bookings.totalPrice) })
    .from(bookings)
    .where(eq(bookings.status, 'completed'))
  const [lastMonthRevenueResult] = await db
    .select({ total: sum(bookings.totalPrice) })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, 'completed'),
        sql`${bookings.createdAt} < ${thisMonthStart.getTime()}`
      )
    )

  // New signups this month
  const [newSignupsResult] = await db
    .select({ count: count() })
    .from(users)
    .where(gte(users.createdAt, thisMonthStart))
  const [lastMonthSignupsResult] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        gte(users.createdAt, lastMonthStart),
        sql`${users.createdAt} < ${thisMonthStart.getTime()}`
      )
    )

  const totalUsers = totalUsersResult.count
  const lastMonthUsers = lastMonthUsersResult.count || totalUsers
  const usersChange = lastMonthUsers > 0 ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

  const totalListings = totalListingsResult.count
  const lastMonthListings = lastMonthListingsResult.count || totalListings
  const listingsChange = lastMonthListings > 0 ? ((totalListings - lastMonthListings) / lastMonthListings) * 100 : 0

  const activeBookings = activeBookingsResult.count
  const lastMonthActiveBookings = lastMonthActiveBookingsResult.count || activeBookings
  const bookingsChange = lastMonthActiveBookings > 0 ? ((activeBookings - lastMonthActiveBookings) / lastMonthActiveBookings) * 100 : 0

  const totalRevenue = Number(revenueResult.total) || 0
  const lastMonthRevenue = Number(lastMonthRevenueResult.total) || totalRevenue
  const revenueChange = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  const newSignups = newSignupsResult.count
  const lastMonthSignups = lastMonthSignupsResult.count || 1
  const signupsChange = lastMonthSignups > 0 ? ((newSignups - lastMonthSignups) / lastMonthSignups) * 100 : 0

  return {
    totalUsers,
    usersChange,
    totalListings,
    listingsChange,
    activeBookings,
    bookingsChange,
    totalRevenue,
    revenueChange,
    newSignups,
    signupsChange,
  }
}

async function getBookingsPerMonth() {
  const now = new Date()
  const months: { month: string; count: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' })

    const [result] = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          gte(bookings.createdAt, monthStart),
          sql`${bookings.createdAt} <= ${monthEnd.getTime()}`
        )
      )

    months.push({ month: monthName, count: result.count })
  }

  return months
}

async function getRevenuePerMonth() {
  const now = new Date()
  const months: { month: string; revenue: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' })

    const [result] = await db
      .select({ total: sum(bookings.totalPrice) })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, 'completed'),
          gte(bookings.createdAt, monthStart),
          sql`${bookings.createdAt} <= ${monthEnd.getTime()}`
        )
      )

    months.push({ month: monthName, revenue: Number(result.total) || 0 })
  }

  return months
}

async function getListingsByCity() {
  const result = await db
    .select({
      city: listings.city,
      count: count(),
    })
    .from(listings)
    .groupBy(listings.city)

  return result
}

async function getUserGrowth() {
  const now = new Date()
  const months: { month: string; users: number }[] = []
  let cumulativeUsers = 0

  for (let i = 5; i >= 0; i--) {
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const monthName = new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleDateString('en-US', { month: 'short' })

    const [result] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.createdAt} <= ${monthEnd.getTime()}`)

    months.push({ month: monthName, users: result.count })
  }

  return months
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const bookingsPerMonth = await getBookingsPerMonth()
  const revenuePerMonth = await getRevenuePerMonth()
  const listingsByCity = await getListingsByCity()
  const userGrowth = await getUserGrowth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#484848]">Dashboard</h1>
        <p className="text-[#767676] mt-1">Overview of your platform statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.usersChange}
          icon="users"
        />
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          change={stats.listingsChange}
          icon="listings"
        />
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings}
          change={stats.bookingsChange}
          icon="bookings"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon="revenue"
        />
        <StatCard
          title="New Signups (This Month)"
          value={stats.newSignups}
          change={stats.signupsChange}
          icon="signups"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-6">
          <h2 className="text-lg font-semibold text-[#484848] mb-4">Bookings Per Month</h2>
          <BarChart data={bookingsPerMonth.map(d => ({ label: d.month, value: d.count }))} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-6">
          <h2 className="text-lg font-semibold text-[#484848] mb-4">Revenue Trend</h2>
          <LineChart data={revenuePerMonth.map(d => ({ label: d.month, value: d.revenue }))} color="#008A05" />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-6">
          <h2 className="text-lg font-semibold text-[#484848] mb-4">Listings by City</h2>
          <PieChart data={listingsByCity.map(d => ({ label: d.city, value: d.count }))} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-6">
          <h2 className="text-lg font-semibold text-[#484848] mb-4">User Growth</h2>
          <LineChart data={userGrowth.map(d => ({ label: d.month, value: d.users }))} color="#FF5A5F" />
        </div>
      </div>
    </div>
  )
}
