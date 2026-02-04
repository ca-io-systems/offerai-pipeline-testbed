'use server'

import { db } from '@/db/index'
import { reservations, listings, users } from '@/db/schema'
import { eq, and, gte, lte, lt, or } from 'drizzle-orm'
import { requireHostAuth } from '@/lib/auth'

export type ReservationFilter = 'all' | 'upcoming' | 'current' | 'past' | 'cancelled'

export type ReservationWithDetails = {
  id: string
  guestName: string
  guestAvatar: string | null
  listingTitle: string
  listingId: string
  checkIn: Date
  checkOut: Date
  guestsCount: number
  totalPrice: number
  hostPayout: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

export async function getHostReservations(
  filter: ReservationFilter = 'all'
): Promise<ReservationWithDetails[]> {
  const hostId = requireHostAuth()
  const now = new Date()
  
  // Get all host's listing IDs
  const hostListings = await db
    .select({ id: listings.id })
    .from(listings)
    .where(eq(listings.hostId, hostId))
  
  const listingIds = hostListings.map(l => l.id)
  if (listingIds.length === 0) return []
  
  // Build the query
  let results = await db
    .select({
      id: reservations.id,
      guestName: users.name,
      guestAvatar: users.avatarUrl,
      listingTitle: listings.title,
      listingId: listings.id,
      checkIn: reservations.checkIn,
      checkOut: reservations.checkOut,
      guestsCount: reservations.guestsCount,
      totalPrice: reservations.totalPrice,
      hostPayout: reservations.hostPayout,
      status: reservations.status,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .innerJoin(users, eq(reservations.guestId, users.id))
    .where(eq(listings.hostId, hostId))
  
  // Apply filter
  if (filter === 'upcoming') {
    results = results.filter(r => r.checkIn > now && r.status !== 'cancelled')
  } else if (filter === 'current') {
    results = results.filter(r => r.checkIn <= now && r.checkOut >= now && r.status !== 'cancelled')
  } else if (filter === 'past') {
    results = results.filter(r => r.checkOut < now && r.status !== 'cancelled')
  } else if (filter === 'cancelled') {
    results = results.filter(r => r.status === 'cancelled')
  }
  
  return results
}

export async function updateReservationStatus(
  reservationId: string,
  status: 'confirmed' | 'cancelled'
): Promise<{ success: boolean }> {
  const hostId = requireHostAuth()
  
  // Verify the reservation belongs to one of the host's listings
  const reservation = await db
    .select({ listingId: reservations.listingId })
    .from(reservations)
    .where(eq(reservations.id, reservationId))
    .limit(1)
  
  if (reservation.length === 0) {
    throw new Error('Reservation not found')
  }
  
  const listing = await db
    .select({ hostId: listings.hostId })
    .from(listings)
    .where(eq(listings.id, reservation[0].listingId))
    .limit(1)
  
  if (listing.length === 0 || listing[0].hostId !== hostId) {
    throw new Error('Unauthorized')
  }
  
  await db
    .update(reservations)
    .set({ status })
    .where(eq(reservations.id, reservationId))
  
  return { success: true }
}
