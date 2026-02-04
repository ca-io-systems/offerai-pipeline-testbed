import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { listings } from '@/db/schema'
import { and, gte, lte, like, inArray, eq, desc, asc, sql } from 'drizzle-orm'

const RESULTS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const location = searchParams.get('location')
  const guests = searchParams.get('guests')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const propertyType = searchParams.get('propertyType')
  const roomType = searchParams.get('roomType')
  const amenities = searchParams.get('amenities')
  const instantBook = searchParams.get('instantBook')
  const sort = searchParams.get('sort') || 'relevance'
  const offset = searchParams.get('offset') || '0'

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

  return NextResponse.json({
    listings: results,
    totalCount: countResult[0].count,
    hasMore: offsetNum + results.length < countResult[0].count,
    offset: offsetNum,
  })
}
