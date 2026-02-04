import { getTripsForGuest } from '@/actions/bookings'
import TripsClient from './TripsClient'

export const dynamic = 'force-dynamic'

export default async function TripsPage() {
  // In a real app, this would come from auth session
  const guestId = 3

  const trips = await getTripsForGuest(guestId)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">My Trips</h1>
      <TripsClient trips={trips} />
    </div>
  )
}
