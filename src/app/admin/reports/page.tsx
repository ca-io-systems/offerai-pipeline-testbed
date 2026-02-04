import { db } from '@/db'
import { reports, users, listings } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { ReportsTable } from '@/components/admin/ReportsTable'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getReports(status?: string) {
  const conditions = []

  if (status && status !== 'all') {
    conditions.push(eq(reports.status, status as 'pending' | 'dismissed' | 'actioned'))
  }

  const reportsData = await db
    .select({
      id: reports.id,
      reason: reports.reason,
      description: reports.description,
      status: reports.status,
      createdAt: reports.createdAt,
      reporterId: reports.reporterId,
      listingId: reports.listingId,
      reviewId: reports.reviewId,
    })
    .from(reports)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(sql`${reports.createdAt} DESC`)

  // Enrich with reporter and listing info
  const enrichedReports = await Promise.all(
    reportsData.map(async (report) => {
      const [reporter] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, report.reporterId))

      let listing = null
      if (report.listingId) {
        const [listingData] = await db
          .select({
            id: listings.id,
            title: listings.title,
            hostId: listings.hostId,
          })
          .from(listings)
          .where(eq(listings.id, report.listingId))

        if (listingData) {
          const [host] = await db
            .select({ name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, listingData.hostId))

          listing = {
            ...listingData,
            hostName: host?.name || 'Unknown',
            hostEmail: host?.email || 'Unknown',
          }
        }
      }

      return {
        ...report,
        reporterName: reporter?.name || 'Unknown',
        reporterEmail: reporter?.email || 'Unknown',
        listing,
      }
    })
  )

  return enrichedReports
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : undefined

  const reportsData = await getReports(status)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#484848]">Reports &amp; Flags</h1>
        <p className="text-[#767676] mt-1">Review and manage reported content</p>
      </div>

      <ReportsTable reports={reportsData} initialStatus={status} />
    </div>
  )
}
