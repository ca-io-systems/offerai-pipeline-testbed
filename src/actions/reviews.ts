'use server'

import { db } from '@/db'
import { reviews, bookings, listings, users } from '@/db/schema'
import { getCurrentUserId } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { createNotification } from './notifications'
import { eq } from 'drizzle-orm'

export async function createReview(data: {
  bookingId: string
  rating: number
  comment?: string
}): Promise<{ id: string }> {
  const authorId = getCurrentUserId()

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, data.bookingId))

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Determine recipient (if author is guest, recipient is host, and vice versa)
  const recipientId = booking.guestId === authorId ? booking.hostId : booking.guestId

  const reviewId = generateId()

  await db.insert(reviews).values({
    id: reviewId,
    bookingId: data.bookingId,
    authorId,
    recipientId,
    rating: data.rating,
    comment: data.comment ?? null,
    createdAt: new Date(),
  })

  // Get author info
  const [author] = await db.select().from(users).where(eq(users.id, authorId))

  // Get listing info
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, booking.listingId))

  // Notify recipient about new review
  await createNotification({
    userId: recipientId,
    type: 'review_received',
    title: 'New Review',
    body: `${author?.name ?? 'Someone'} left you a ${data.rating}-star review for "${listing?.title ?? 'a stay'}"`,
    linkUrl: `/reviews/${reviewId}`,
  })

  return { id: reviewId }
}
