'use server'

import { db } from '@/db'
import { reviews, bookings, hostResponses, listings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const bookingId = Number(formData.get('bookingId'))
  const listingId = Number(formData.get('listingId'))
  const overallRating = Number(formData.get('overallRating'))
  const cleanlinessRating = Number(formData.get('cleanlinessRating'))
  const accuracyRating = Number(formData.get('accuracyRating'))
  const checkinRating = Number(formData.get('checkinRating'))
  const communicationRating = Number(formData.get('communicationRating'))
  const locationRating = Number(formData.get('locationRating'))
  const valueRating = Number(formData.get('valueRating'))
  const reviewText = formData.get('reviewText') as string

  // Validate ratings
  const ratings = [overallRating, cleanlinessRating, accuracyRating, checkinRating, communicationRating, locationRating, valueRating]
  if (ratings.some((r) => r < 1 || r > 5)) {
    return { error: 'All ratings must be between 1 and 5' }
  }

  // Validate review text
  if (!reviewText || reviewText.length < 50) {
    return { error: 'Review must be at least 50 characters' }
  }

  // Check booking exists and is completed
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  })

  if (!booking) {
    return { error: 'Booking not found' }
  }

  if (booking.status !== 'completed') {
    return { error: 'Can only review completed bookings' }
  }

  // Check for existing review (prevent duplicates)
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.bookingId, bookingId),
  })

  if (existingReview) {
    return { error: 'You have already reviewed this booking' }
  }

  // Insert review
  await db.insert(reviews).values({
    bookingId,
    listingId,
    guestId: booking.guestId,
    overallRating,
    cleanlinessRating,
    accuracyRating,
    checkinRating,
    communicationRating,
    locationRating,
    valueRating,
    reviewText,
  })

  revalidatePath(`/listings/${listingId}`)
  revalidatePath('/')

  return { success: true }
}

export async function submitHostResponse(formData: FormData) {
  const reviewId = Number(formData.get('reviewId'))
  const hostId = Number(formData.get('hostId'))
  const responseText = formData.get('responseText') as string

  if (!responseText || responseText.trim().length === 0) {
    return { error: 'Response cannot be empty' }
  }

  // Check review exists
  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  })

  if (!review) {
    return { error: 'Review not found' }
  }

  // Check listing belongs to host
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, review.listingId),
  })

  if (!listing || listing.hostId !== hostId) {
    return { error: 'Only the host can respond to this review' }
  }

  // Check for existing response
  const existingResponse = await db.query.hostResponses.findFirst({
    where: eq(hostResponses.reviewId, reviewId),
  })

  if (existingResponse) {
    return { error: 'You have already responded to this review' }
  }

  await db.insert(hostResponses).values({
    reviewId,
    hostId,
    responseText: responseText.trim(),
  })

  revalidatePath(`/listings/${review.listingId}`)

  return { success: true }
}
