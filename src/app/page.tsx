import { getListings } from '@/actions/listings'
import { isListingSaved } from '@/actions/wishlists'
import { ListingCard } from '@/components/ListingCard'

export default async function HomePage() {
  const listings = await getListings()
  
  const listingsWithSaved = await Promise.all(
    listings.map(async (listing) => ({
      listing,
      isSaved: await isListingSaved(listing.id),
    }))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-[#484848] mb-6">
        Explore places to stay
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listingsWithSaved.map(({ listing, isSaved }) => (
          <ListingCard key={listing.id} listing={listing} isSaved={isSaved} />
        ))}
      </div>

      {listings.length === 0 && (
        <p className="text-center text-[#767676] py-12">
          No listings found. Run `bun run db:seed` to add sample data.
        </p>
      )}
    </div>
  )
}
