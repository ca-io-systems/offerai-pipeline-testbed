import { db } from '@/db'
import { listings, listingPricing, seasonalPricing } from '@/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export interface DatePriceInfo {
  date: string
  price: number
  basePrice: number
  isCustom: boolean
  isWeekend: boolean
  seasonName?: string
  minimumStay: number
  isAvailable: boolean
}

export interface PriceCalculation {
  dates: DatePriceInfo[]
  totalPrice: number
  averageNightlyPrice: number
  nights: number
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 5 || day === 6
}

function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current < end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export async function getDatePrice(
  listingId: number,
  date: string
): Promise<DatePriceInfo> {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    throw new Error('Listing not found')
  }

  const dateObj = new Date(date)
  const isWeekendDay = isWeekend(dateObj)

  // Check for per-date pricing override
  const dateOverride = await db.query.listingPricing.findFirst({
    where: and(
      eq(listingPricing.listingId, listingId),
      eq(listingPricing.date, date)
    ),
  })

  if (dateOverride) {
    return {
      date,
      price: dateOverride.price ?? listing.basePrice,
      basePrice: listing.basePrice,
      isCustom: dateOverride.price !== null,
      isWeekend: isWeekendDay,
      minimumStay: dateOverride.minimumStay ?? listing.defaultMinimumStay,
      isAvailable: dateOverride.isAvailable,
    }
  }

  // Check for seasonal pricing
  const seasons = await db.query.seasonalPricing.findMany({
    where: and(
      eq(seasonalPricing.listingId, listingId),
      lte(seasonalPricing.startDate, date),
      gte(seasonalPricing.endDate, date)
    ),
  })

  let price = listing.basePrice
  let seasonName: string | undefined
  let isCustom = false

  if (seasons.length > 0) {
    // Apply highest multiplier if multiple seasons overlap
    const highestSeason = seasons.reduce((prev, current) =>
      current.multiplier > prev.multiplier ? current : prev
    )
    price = listing.basePrice * highestSeason.multiplier
    seasonName = highestSeason.name
    isCustom = true
  }

  // Apply weekend multiplier if not already in a season
  if (isWeekendDay && listing.weekendMultiplier > 1) {
    if (!seasonName) {
      price = listing.basePrice * listing.weekendMultiplier
      isCustom = true
    } else {
      // Stack weekend multiplier on top of seasonal pricing
      price = price * listing.weekendMultiplier
    }
  }

  return {
    date,
    price: Math.round(price * 100) / 100,
    basePrice: listing.basePrice,
    isCustom,
    isWeekend: isWeekendDay,
    seasonName,
    minimumStay: listing.defaultMinimumStay,
    isAvailable: true,
  }
}

export async function calculateBookingPrice(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<PriceCalculation> {
  const dates = getDatesInRange(checkIn, checkOut)
  const priceInfos: DatePriceInfo[] = []

  for (const date of dates) {
    const info = await getDatePrice(listingId, date)
    priceInfos.push(info)
  }

  const totalPrice = priceInfos.reduce((sum, info) => sum + info.price, 0)

  return {
    dates: priceInfos,
    totalPrice: Math.round(totalPrice * 100) / 100,
    averageNightlyPrice: Math.round((totalPrice / dates.length) * 100) / 100,
    nights: dates.length,
  }
}

export async function getMonthPricing(
  listingId: number,
  year: number,
  month: number
): Promise<DatePriceInfo[]> {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  
  const dates: string[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  const priceInfos: DatePriceInfo[] = []
  for (const date of dates) {
    const info = await getDatePrice(listingId, date)
    priceInfos.push(info)
  }

  return priceInfos
}

export async function getSmartPricingSuggestion(
  listingId: number
): Promise<{ averageAreaPrice: number; similarListings: number }> {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    throw new Error('Listing not found')
  }

  // Find similar listings in the same location
  const similarListings = await db.query.listings.findMany({
    where: eq(listings.location, listing.location),
  })

  if (similarListings.length <= 1) {
    return {
      averageAreaPrice: listing.basePrice,
      similarListings: 0,
    }
  }

  const otherListings = similarListings.filter(l => l.id !== listingId)
  const averagePrice = otherListings.reduce((sum, l) => sum + l.basePrice, 0) / otherListings.length

  return {
    averageAreaPrice: Math.round(averagePrice * 100) / 100,
    similarListings: otherListings.length,
  }
}
