import Image from 'next/image'
import Link from 'next/link'

const upcomingTrips = [
  {
    id: '1',
    listing: 'Cozy apartment with ocean view',
    location: 'Malibu, California',
    dates: 'Dec 15-20, 2024',
    image: 'https://picsum.photos/seed/trip1/400/300',
    host: 'Sarah',
  },
]

const pastTrips = [
  {
    id: '2',
    listing: 'Mountain cabin retreat',
    location: 'Lake Tahoe, California',
    dates: 'Nov 10-15, 2024',
    image: 'https://picsum.photos/seed/trip2/400/300',
    host: 'Mike',
  },
  {
    id: '3',
    listing: 'Modern loft in downtown',
    location: 'New York, New York',
    dates: 'Oct 5-8, 2024',
    image: 'https://picsum.photos/seed/trip3/400/300',
    host: 'Emily',
  },
]

export default function TripsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#484848] mb-6">Trips</h1>

      {/* Upcoming Trips */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#484848] mb-4">Upcoming</h2>
        {upcomingTrips.length === 0 ? (
          <div className="bg-[#F7F7F7] rounded-xl p-6 text-center">
            <p className="text-[#767676]">No trips booked...yet!</p>
            <Link href="/" className="inline-block mt-4 px-6 py-3 bg-[#FF5A5F] text-white font-medium rounded-lg hover:bg-[#E04E52] transition-colors">
              Start searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block bg-white rounded-xl border border-[#EBEBEB] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={trip.image}
                    alt={trip.listing}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#484848]">{trip.listing}</h3>
                  <p className="text-sm text-[#767676] mt-1">{trip.location}</p>
                  <p className="text-sm text-[#767676]">{trip.dates}</p>
                  <p className="text-sm text-[#767676] mt-2">Hosted by {trip.host}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Past Trips */}
      <section>
        <h2 className="text-lg font-semibold text-[#484848] mb-4">Where you&apos;ve been</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTrips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block bg-white rounded-xl border border-[#EBEBEB] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={trip.image}
                  alt={trip.listing}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#484848]">{trip.listing}</h3>
                <p className="text-sm text-[#767676] mt-1">{trip.location}</p>
                <p className="text-sm text-[#767676]">{trip.dates}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
