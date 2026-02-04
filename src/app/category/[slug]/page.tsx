import { notFound } from 'next/navigation'
import { CategoryNav } from '@/components/CategoryNav'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ListingCard } from '@/components/ListingCard'
import { 
  getCategories, 
  getCategoryBySlug, 
  getListingsWithAmenitiesByCategory,
  getListingCountByCategory 
} from '@/lib/queries'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }
  return { title: `${category.name} - OfferBnb` }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [categories, category] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
  ])

  if (!category) {
    notFound()
  }

  const [listings, count] = await Promise.all([
    getListingsWithAmenitiesByCategory(category.id),
    getListingCountByCategory(category.id),
  ])

  return (
    <div>
      <div className="border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryNav categories={categories} activeSlug={slug} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon icon={category.icon} size={32} className="text-[#484848]" />
            <h1 className="text-3xl font-bold text-[#484848]">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-[#767676] text-lg mb-2">{category.description}</p>
          )}
          <p className="text-[#767676]">
            {count} {count === 1 ? 'property' : 'properties'} available
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#767676] text-lg">No properties found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                amenities={listing.amenities}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
