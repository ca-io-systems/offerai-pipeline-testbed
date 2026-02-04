import { getHostListings } from '@/actions/listings'
import { getHostReservations } from '@/actions/reservations'
import { getEarningsSummary, getMonthlyEarnings, getEarningsTransactions } from '@/actions/earnings'
import HostDashboardClient from './HostDashboardClient'

export const metadata = {
  title: 'Host Dashboard | OfferBnb',
}

export default async function HostDashboardPage() {
  const [listings, reservations, summary, monthlyEarnings, transactions] = await Promise.all([
    getHostListings(),
    getHostReservations(),
    getEarningsSummary(),
    getMonthlyEarnings(),
    getEarningsTransactions(),
  ])
  
  return (
    <HostDashboardClient
      listings={listings}
      reservations={reservations}
      summary={summary}
      monthlyEarnings={monthlyEarnings}
      transactions={transactions}
    />
  )
}
