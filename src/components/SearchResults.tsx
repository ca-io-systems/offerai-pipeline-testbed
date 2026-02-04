import { searchListings } from '@/actions/search'
import { ListingCard } from './ListingCard'

interface SearchResultsProps {
  searchParams: { [key: string]: string | undefined }
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const { listings, totalCount } = await searchListings({
    location: searchParams.location,
    locationId: searchParams.locationId ? Number(searchParams.locationId) : undefined,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? Number(searchParams.guests) : undefined,
    latitude: searchParams.latitude ? Number(searchParams.latitude) : undefined,
    longitude: searchParams.longitude ? Number(searchParams.longitude) : undefined,
    radius: searchParams.radius ? Number(searchParams.radius) : 50,
  })

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-[#484848] mb-2">No listings found</h3>
        <p className="text-[#767676]">
          Try adjusting your search criteria or exploring different locations
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 text-[#767676]">
        {totalCount} {totalCount === 1 ? 'listing' : 'listings'} found
        {searchParams.location && ` in "${searchParams.location}"`}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
