import { CategoryNav } from '@/components/CategoryNav'
import { ListingCard } from '@/components/ListingCard'
import { getCategories, getListingsWithAmenities } from '@/lib/queries'

export default async function HomePage() {
  const [categories, listings] = await Promise.all([
    getCategories(),
    getListingsWithAmenities(),
  ])

  return (
    <div>
      <div className="border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryNav categories={categories} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing}
              amenities={listing.amenities}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
