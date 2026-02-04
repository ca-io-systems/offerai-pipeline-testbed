import { db } from '@/db'
import { categories, listings, amenities, listingAmenities } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function getCategories() {
  return db.select().from(categories)
}

export async function getCategoryBySlug(slug: string) {
  const results = await db.select().from(categories).where(eq(categories.slug, slug))
  return results[0] || null
}

export async function getListings() {
  return db.select().from(listings)
}

export async function getListingsByCategory(categoryId: number) {
  return db.select().from(listings).where(eq(listings.categoryId, categoryId))
}

export async function getListingCountByCategory(categoryId: number) {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.categoryId, categoryId))
  return result[0]?.count || 0
}

export async function getListingAmenities(listingId: number) {
  return db
    .select({
      id: amenities.id,
      name: amenities.name,
      slug: amenities.slug,
      icon: amenities.icon,
    })
    .from(listingAmenities)
    .innerJoin(amenities, eq(listingAmenities.amenityId, amenities.id))
    .where(eq(listingAmenities.listingId, listingId))
}

export async function getListingsWithAmenities() {
  const allListings = await getListings()
  const listingsWithAmenities = await Promise.all(
    allListings.map(async (listing) => ({
      ...listing,
      amenities: await getListingAmenities(listing.id),
    }))
  )
  return listingsWithAmenities
}

export async function getListingsWithAmenitiesByCategory(categoryId: number) {
  const categoryListings = await getListingsByCategory(categoryId)
  const listingsWithAmenities = await Promise.all(
    categoryListings.map(async (listing) => ({
      ...listing,
      amenities: await getListingAmenities(listing.id),
    }))
  )
  return listingsWithAmenities
}
