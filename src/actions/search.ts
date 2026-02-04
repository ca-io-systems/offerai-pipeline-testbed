'use server'

import { db } from '@/db/index'
import { locations, listings } from '@/db/schema'
import { like, eq, sql, and, gte, lte } from 'drizzle-orm'
import type { LocationSuggestion, ListingWithDistance, SearchParams } from '@/lib/types'
import { calculateDistance } from '@/lib/distance'

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 1) return []

  const searchPattern = `%${query}%`

  const results = await db
    .select({
      id: locations.id,
      city: locations.city,
      region: locations.region,
      country: locations.country,
      latitude: locations.latitude,
      longitude: locations.longitude,
      imageUrl: locations.imageUrl,
      isPopular: locations.isPopular,
      listingCount: sql<number>`(SELECT COUNT(*) FROM listings WHERE listings.location_id = ${locations.id})`.as('listing_count'),
    })
    .from(locations)
    .where(
      sql`${locations.city} LIKE ${searchPattern} OR ${locations.region} LIKE ${searchPattern} OR ${locations.country} LIKE ${searchPattern}`
    )
    .orderBy(
      sql`CASE
        WHEN LOWER(${locations.city}) = LOWER(${query}) THEN 0
        WHEN LOWER(${locations.city}) LIKE LOWER(${query + '%'}) THEN 1
        WHEN LOWER(${locations.city}) LIKE LOWER(${'%' + query + '%'}) THEN 2
        ELSE 3
      END`
    )
    .limit(10)

  return results
}

export async function getPopularDestinations(): Promise<LocationSuggestion[]> {
  const results = await db
    .select({
      id: locations.id,
      city: locations.city,
      region: locations.region,
      country: locations.country,
      latitude: locations.latitude,
      longitude: locations.longitude,
      imageUrl: locations.imageUrl,
      isPopular: locations.isPopular,
      listingCount: sql<number>`(SELECT COUNT(*) FROM listings WHERE listings.location_id = ${locations.id})`.as('listing_count'),
    })
    .from(locations)
    .where(eq(locations.isPopular, true))
    .limit(6)

  return results
}

export async function searchListings(params: SearchParams): Promise<{ listings: ListingWithDistance[], totalCount: number }> {
  const { location, locationId, checkIn, checkOut, guests, latitude, longitude, radius = 50 } = params

  let whereConditions = []

  if (locationId) {
    whereConditions.push(eq(listings.locationId, locationId))
  }

  if (guests) {
    whereConditions.push(gte(listings.maxGuests, guests))
  }

  // Fuzzy search on title and description if location text is provided (not locationId)
  if (location && !locationId) {
    const searchPattern = `%${location}%`
    whereConditions.push(
      sql`(${listings.title} LIKE ${searchPattern} OR ${listings.description} LIKE ${searchPattern})`
    )
  }

  let baseQuery = db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      locationId: listings.locationId,
      pricePerNight: listings.pricePerNight,
      maxGuests: listings.maxGuests,
      latitude: listings.latitude,
      longitude: listings.longitude,
      imageUrl: listings.imageUrl,
      createdAt: listings.createdAt,
      locationName: sql<string>`(SELECT city || ', ' || country FROM locations WHERE locations.id = ${listings.locationId})`.as('location_name'),
    })
    .from(listings)

  if (whereConditions.length > 0) {
    baseQuery = baseQuery.where(and(...whereConditions)) as typeof baseQuery
  }

  const results = await baseQuery

  let processedResults: ListingWithDistance[] = results.map(r => ({
    ...r,
    locationName: r.locationName,
  }))

  // If geolocation is provided, filter by radius and sort by distance
  if (latitude !== undefined && longitude !== undefined) {
    processedResults = processedResults
      .map(listing => ({
        ...listing,
        distance: calculateDistance(latitude, longitude, listing.latitude, listing.longitude),
      }))
      .filter(listing => listing.distance! <= radius)
      .sort((a, b) => a.distance! - b.distance!)
  }

  // Fuzzy ranking for text search
  if (location && !locationId && !latitude) {
    const query = location.toLowerCase()
    processedResults = processedResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()

      // Exact match in title
      if (aTitle.includes(query) && !bTitle.includes(query)) return -1
      if (!aTitle.includes(query) && bTitle.includes(query)) return 1

      // Starts with
      if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1
      if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1

      return 0
    })
  }

  return {
    listings: processedResults,
    totalCount: processedResults.length,
  }
}

export async function getLocationById(id: number) {
  const result = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1)

  return result[0] || null
}
