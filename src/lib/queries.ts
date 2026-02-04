import { db } from '@/db'
import { listings, hosts, listingPhotos, amenities, listingAmenities, reviews } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getListingById(id: number) {
  const result = await db
    .select()
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1)

  return result[0] || null
}

export async function getHostById(id: number) {
  const result = await db
    .select()
    .from(hosts)
    .where(eq(hosts.id, id))
    .limit(1)

  return result[0] || null
}

export async function getListingPhotos(listingId: number) {
  return db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, listingId))
    .orderBy(listingPhotos.order)
}

export async function getListingAmenities(listingId: number) {
  return db
    .select({
      id: amenities.id,
      name: amenities.name,
      icon: amenities.icon,
    })
    .from(listingAmenities)
    .innerJoin(amenities, eq(listingAmenities.amenityId, amenities.id))
    .where(eq(listingAmenities.listingId, listingId))
}

export async function getListingReviews(listingId: number) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.listingId, listingId))
}

export function calculateReviewAverages(reviewsList: typeof reviews.$inferSelect[]) {
  if (reviewsList.length === 0) {
    return {
      cleanliness: 0,
      accuracy: 0,
      checkIn: 0,
      communication: 0,
      location: 0,
      value: 0,
    }
  }

  const totals = reviewsList.reduce(
    (acc, review) => ({
      cleanliness: acc.cleanliness + review.cleanliness,
      accuracy: acc.accuracy + review.accuracy,
      checkIn: acc.checkIn + review.checkIn,
      communication: acc.communication + review.communication,
      location: acc.location + review.location,
      value: acc.value + review.value,
    }),
    { cleanliness: 0, accuracy: 0, checkIn: 0, communication: 0, location: 0, value: 0 }
  )

  const count = reviewsList.length
  return {
    cleanliness: totals.cleanliness / count,
    accuracy: totals.accuracy / count,
    checkIn: totals.checkIn / count,
    communication: totals.communication / count,
    location: totals.location / count,
    value: totals.value / count,
  }
}
