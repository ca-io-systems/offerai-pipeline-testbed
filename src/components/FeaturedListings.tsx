import ListingCard from './ListingCard'
import type { Listing } from '@/db/schema'

interface FeaturedListingsProps {
  listings: Listing[]
}

export default function FeaturedListings({ listings }: FeaturedListingsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-[#484848] mb-6">Popular destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.slice(0, 12).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  )
}
