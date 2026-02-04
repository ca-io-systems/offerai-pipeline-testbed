'use server'

import { db } from '@/db'
import { listings, listingPricing, seasonalPricing } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function setDatePricing(
  listingId: number,
  dates: string[],
  price: number | null,
  minimumStay: number | null,
  isAvailable: boolean
) {
  // Delete existing entries for these dates
  for (const date of dates) {
    await db.delete(listingPricing).where(
      and(
        eq(listingPricing.listingId, listingId),
        eq(listingPricing.date, date)
      )
    )
  }

  // Insert new entries
  if (price !== null || minimumStay !== null || !isAvailable) {
    await db.insert(listingPricing).values(
      dates.map(date => ({
        listingId,
        date,
        price,
        minimumStay,
        isAvailable,
      }))
    )
  }

  revalidatePath(`/host/calendar/${listingId}`)
  revalidatePath(`/listings/${listingId}`)
}

export async function clearDatePricing(listingId: number, dates: string[]) {
  for (const date of dates) {
    await db.delete(listingPricing).where(
      and(
        eq(listingPricing.listingId, listingId),
        eq(listingPricing.date, date)
      )
    )
  }

  revalidatePath(`/host/calendar/${listingId}`)
  revalidatePath(`/listings/${listingId}`)
}

export async function updateWeekendMultiplier(
  listingId: number,
  multiplier: number
) {
  await db.update(listings)
    .set({ weekendMultiplier: multiplier })
    .where(eq(listings.id, listingId))

  revalidatePath(`/host/calendar/${listingId}`)
  revalidatePath(`/listings/${listingId}`)
}

export async function createSeasonalPricing(
  listingId: number,
  name: string,
  startDate: string,
  endDate: string,
  multiplier: number
) {
  await db.insert(seasonalPricing).values({
    listingId,
    name,
    startDate,
    endDate,
    multiplier,
  })

  revalidatePath(`/host/calendar/${listingId}`)
  revalidatePath(`/listings/${listingId}`)
}

export async function updateSeasonalPricing(
  id: number,
  name: string,
  startDate: string,
  endDate: string,
  multiplier: number
) {
  const season = await db.query.seasonalPricing.findFirst({
    where: eq(seasonalPricing.id, id),
  })

  if (!season) {
    throw new Error('Seasonal pricing not found')
  }

  await db.update(seasonalPricing)
    .set({ name, startDate, endDate, multiplier })
    .where(eq(seasonalPricing.id, id))

  revalidatePath(`/host/calendar/${season.listingId}`)
  revalidatePath(`/listings/${season.listingId}`)
}

export async function deleteSeasonalPricing(id: number) {
  const season = await db.query.seasonalPricing.findFirst({
    where: eq(seasonalPricing.id, id),
  })

  if (!season) {
    throw new Error('Seasonal pricing not found')
  }

  await db.delete(seasonalPricing).where(eq(seasonalPricing.id, id))

  revalidatePath(`/host/calendar/${season.listingId}`)
  revalidatePath(`/listings/${season.listingId}`)
}

export async function getListingSeasons(listingId: number) {
  return db.query.seasonalPricing.findMany({
    where: eq(seasonalPricing.listingId, listingId),
  })
}

export async function getListing(listingId: number) {
  return db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })
}
