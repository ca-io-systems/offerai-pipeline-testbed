import { Suspense } from 'react'
import { db } from '@/db'
import { listings } from '@/db/schema'
import { and, gte, lte, like, inArray, eq, desc, asc, sql } from 'drizzle-orm'
import { FilterBar } from '@/components/FilterBar'
import { SearchResults } from '@/components/SearchResults'

const RESULTS_PER_PAGE = 20

interface SearchPageProps {
  searchParams: Promise<{
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    propertyType?: string
    roomType?: string
    amenities?: string
    instantBook?: string
    sort?: string
    offset?: string
  }>
}

async function getListings(params: Awaited<SearchPageProps['searchParams']>) {
  const {
    location,
    guests,
    minPrice,
    maxPrice,
    propertyType,
    roomType,
    amenities,
    instantBook,
    sort = 'relevance',
    offset = '0',
  } = params

  const conditions = []

  if (location) {
    conditions.push(like(listings.location, `%${location}%`))
  }

  if (guests) {
    conditions.push(gte(listings.maxGuests, parseInt(guests, 10)))
  }

  if (minPrice) {
    conditions.push(gte(listings.pricePerNight, parseFloat(minPrice)))
  }

  if (maxPrice) {
    conditions.push(lte(listings.pricePerNight, parseFloat(maxPrice)))
  }

  if (propertyType) {
    const types = propertyType.split(',').filter(Boolean)
    if (types.length > 0) {
      conditions.push(inArray(listings.propertyType, types))
    }
  }

  if (roomType) {
    conditions.push(eq(listings.roomType, roomType))
  }

  if (amenities) {
    const amenityList = amenities.split(',').filter(Boolean)
    for (const amenity of amenityList) {
      conditions.push(like(listings.amenities, `%"${amenity}"%`))
    }
  }

  if (instantBook === 'true') {
    conditions.push(eq(listings.instantBook, true))
  }

  let orderBy
  switch (sort) {
    case 'price_asc':
      orderBy = asc(listings.pricePerNight)
      break
    case 'price_desc':
      orderBy = desc(listings.pricePerNight)
      break
    case 'rating':
      orderBy = desc(listings.rating)
      break
    case 'newest':
      orderBy = desc(listings.createdAt)
      break
    default:
      orderBy = desc(listings.rating)
  }

  const offsetNum = parseInt(offset, 10) || 0

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [results, countResult] = await Promise.all([
    db
      .select()
      .from(listings)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetNum),
    db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(whereClause),
  ])

  return {
    listings: results,
    totalCount: countResult[0].count,
    hasMore: offsetNum + results.length < countResult[0].count,
    offset: offsetNum,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { listings: results, totalCount, hasMore, offset } = await getListings(params)

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="h-16 bg-white border-b border-[#EBEBEB]" />}>
        <FilterBar />
      </Suspense>

      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-[#767676] mb-6">
          {totalCount > 300 ? '300+ places' : `${totalCount} place${totalCount !== 1 ? 's' : ''}`}
        </p>

        <SearchResults
          initialListings={results}
          totalCount={totalCount}
          hasMore={hasMore}
          initialOffset={offset}
        />
      </div>
    </div>
  )
}
