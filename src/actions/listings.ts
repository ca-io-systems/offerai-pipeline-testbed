'use server'

import { db } from '@/db'
import { listings } from '@/db/schema'
import { getCurrentUserId } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { createNotification } from './notifications'
import { eq } from 'drizzle-orm'

export async function createListing(data: {
  title: string
  description?: string
  pricePerNight: number
}): Promise<{ id: string }> {
  const hostId = getCurrentUserId()

  const listingId = generateId()

  await db.insert(listings).values({
    id: listingId,
    hostId,
    title: data.title,
    description: data.description ?? null,
    pricePerNight: data.pricePerNight,
    createdAt: new Date(),
  })

  // Notify host that their listing is published
  await createNotification({
    userId: hostId,
    type: 'listing_published',
    title: 'Listing Published!',
    body: `Your listing "${data.title}" is now live and visible to guests`,
    linkUrl: `/listings/${listingId}`,
  })

  return { id: listingId }
}

export async function updateListingPrice(
  listingId: string,
  newPrice: number
): Promise<void> {
  const hostId = getCurrentUserId()

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))

  if (!listing) {
    throw new Error('Listing not found')
  }

  if (listing.hostId !== hostId) {
    throw new Error('Unauthorized')
  }

  const oldPrice = listing.pricePerNight

  await db
    .update(listings)
    .set({ pricePerNight: newPrice })
    .where(eq(listings.id, listingId))

  // Notify host about price change
  await createNotification({
    userId: hostId,
    type: 'price_change',
    title: 'Price Updated',
    body: `Price for "${listing.title}" changed from $${oldPrice} to $${newPrice} per night`,
    linkUrl: `/listings/${listingId}`,
  })
}
