'use server'

import { db } from '@/db'
import { bookings, listings, users } from '@/db/schema'
import { getCurrentUserId } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { createNotification } from './notifications'
import { eq } from 'drizzle-orm'

export async function createBooking(data: {
  listingId: string
  checkIn: Date
  checkOut: Date
}): Promise<{ id: string }> {
  const guestId = getCurrentUserId()

  // Get listing and host info
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, data.listingId))

  if (!listing) {
    throw new Error('Listing not found')
  }

  const bookingId = generateId()

  await db.insert(bookings).values({
    id: bookingId,
    listingId: data.listingId,
    guestId,
    hostId: listing.hostId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    status: 'pending',
    createdAt: new Date(),
  })

  // Notify host about new booking request
  const [guest] = await db.select().from(users).where(eq(users.id, guestId))

  await createNotification({
    userId: listing.hostId,
    type: 'booking_request',
    title: 'New Booking Request',
    body: `${guest?.name ?? 'A guest'} has requested to book "${listing.title}"`,
    linkUrl: `/bookings/${bookingId}`,
  })

  return { id: bookingId }
}

export async function confirmBooking(bookingId: string): Promise<void> {
  const userId = getCurrentUserId()

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))

  if (!booking) {
    throw new Error('Booking not found')
  }

  if (booking.hostId !== userId) {
    throw new Error('Unauthorized')
  }

  await db
    .update(bookings)
    .set({ status: 'confirmed' })
    .where(eq(bookings.id, bookingId))

  // Get listing info
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, booking.listingId))

  // Notify guest about confirmation
  await createNotification({
    userId: booking.guestId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    body: `Your booking for "${listing?.title ?? 'a listing'}" has been confirmed`,
    linkUrl: `/bookings/${bookingId}`,
  })
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const userId = getCurrentUserId()

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Either host or guest can cancel
  if (booking.hostId !== userId && booking.guestId !== userId) {
    throw new Error('Unauthorized')
  }

  await db
    .update(bookings)
    .set({ status: 'cancelled' })
    .where(eq(bookings.id, bookingId))

  // Get listing info
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, booking.listingId))

  // Notify the other party
  const recipientId = booking.hostId === userId ? booking.guestId : booking.hostId

  await createNotification({
    userId: recipientId,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    body: `A booking for "${listing?.title ?? 'a listing'}" has been cancelled`,
    linkUrl: `/bookings/${bookingId}`,
  })
}
