'use server'

import { db } from '@/db/index'
import { listings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireHostAuth } from '@/lib/auth'

export type ListingWithStats = {
  id: string
  title: string
  coverImage: string | null
  pricePerNight: number
  status: 'published' | 'draft' | 'paused'
  rating: number | null
  reviewCount: number | null
  viewCount: number | null
}

export async function getHostListings(): Promise<ListingWithStats[]> {
  const hostId = requireHostAuth()
  
  const results = await db
    .select({
      id: listings.id,
      title: listings.title,
      coverImage: listings.coverImage,
      pricePerNight: listings.pricePerNight,
      status: listings.status,
      rating: listings.rating,
      reviewCount: listings.reviewCount,
      viewCount: listings.viewCount,
    })
    .from(listings)
    .where(eq(listings.hostId, hostId))
  
  return results
}

export async function updateListingStatus(
  listingId: string,
  status: 'published' | 'draft' | 'paused'
): Promise<{ success: boolean }> {
  const hostId = requireHostAuth()
  
  await db
    .update(listings)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(listings.id, listingId), eq(listings.hostId, hostId)))
  
  return { success: true }
}

export async function deleteListing(listingId: string): Promise<{ success: boolean }> {
  const hostId = requireHostAuth()
  
  await db
    .delete(listings)
    .where(and(eq(listings.id, listingId), eq(listings.hostId, hostId)))
  
  return { success: true }
}
