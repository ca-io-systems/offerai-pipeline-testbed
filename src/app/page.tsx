import { db } from '@/db'
import { listings, reviews } from '@/db/schema'
import { eq, avg, count } from 'drizzle-orm'
import { ListingCard } from '@/components/ListingCard'

async function getListingsWithRatings() {
  const listingsData = await db.select().from(listings)
  
  const listingsWithRatings = await Promise.all(
    listingsData.map(async (listing) => {
      const reviewStats = await db
        .select({
          avgRating: avg(reviews.overallRating),
          reviewCount: count(reviews.id),
        })
        .from(reviews)
        .where(eq(reviews.listingId, listing.id))
      
      return {
        ...listing,
        avgRating: reviewStats[0]?.avgRating ? Number(reviewStats[0].avgRating) : null,
        reviewCount: reviewStats[0]?.reviewCount ?? 0,
      }
    })
  )
  
  return listingsWithRatings
}

export default async function HomePage() {
  const listingsWithRatings = await getListingsWithRatings()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Explore stays</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listingsWithRatings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
