'use server'

import { db } from '@/db'
import { bookings, listings, users, reviews } from '@/db/schema'
import { eq, and, or, lt, gte } from 'drizzle-orm'
import { calculateRefund } from '@/lib/utils'
import type { TripData } from '@/components/TripCard'

export async function getTripsForGuest(guestId: number) {
  const today = new Date().toISOString().split('T')[0]
  
  const allBookings = await db
    .select({
      id: bookings.id,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      cancellationReason: bookings.cancellationReason,
      cancellationDate: bookings.cancellationDate,
      refundAmount: bookings.refundAmount,
      listingId: listings.id,
      listingTitle: listings.title,
      listingCity: listings.city,
      listingImage: listings.image,
      listingPolicy: listings.cancellationPolicy,
      hostId: users.id,
      hostName: users.name,
      hostAvatar: users.avatar,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .innerJoin(users, eq(listings.hostId, users.id))
    .where(eq(bookings.guestId, guestId))

  const bookingIds = allBookings.map(b => b.id)
  const existingReviews = bookingIds.length > 0 
    ? await db.select({ bookingId: reviews.bookingId }).from(reviews).where(
        or(...bookingIds.map(id => eq(reviews.bookingId, id)))
      )
    : []
  const reviewedBookingIds = new Set(existingReviews.map(r => r.bookingId))

  const formatTrip = (booking: typeof allBookings[0]): TripData & { cancellationPolicy: string } => ({
    id: booking.id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,
    status: booking.status,
    cancellationReason: booking.cancellationReason,
    cancellationDate: booking.cancellationDate,
    refundAmount: booking.refundAmount,
    cancellationPolicy: booking.listingPolicy,
    listing: {
      id: booking.listingId,
      title: booking.listingTitle,
      city: booking.listingCity,
      image: booking.listingImage,
    },
    host: {
      id: booking.hostId,
      name: booking.hostName,
      avatar: booking.hostAvatar,
    },
    hasReview: reviewedBookingIds.has(booking.id),
  })

  const upcoming = allBookings
    .filter(b => b.checkIn >= today && b.status !== 'cancelled')
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .map(formatTrip)

  const past = allBookings
    .filter(b => b.checkOut < today && b.status !== 'cancelled')
    .sort((a, b) => b.checkOut.localeCompare(a.checkOut))
    .map(formatTrip)

  const cancelled = allBookings
    .filter(b => b.status === 'cancelled')
    .sort((a, b) => (b.cancellationDate || '').localeCompare(a.cancellationDate || ''))
    .map(formatTrip)

  return { upcoming, past, cancelled }
}

export async function cancelBooking(
  bookingId: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [booking] = await db
      .select({
        id: bookings.id,
        totalPrice: bookings.totalPrice,
        checkIn: bookings.checkIn,
        status: bookings.status,
        listingPolicy: listings.cancellationPolicy,
      })
      .from(bookings)
      .innerJoin(listings, eq(bookings.listingId, listings.id))
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!booking) {
      return { success: false, error: 'Booking not found' }
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Booking is already cancelled' }
    }

    const refundAmount = calculateRefund(
      booking.totalPrice,
      booking.checkIn,
      booking.listingPolicy
    )

    await db
      .update(bookings)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
        cancellationDate: new Date().toISOString().split('T')[0],
        refundAmount,
      })
      .where(eq(bookings.id, bookingId))

    return { success: true }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    return { success: false, error: 'Failed to cancel booking' }
  }
}

export async function getBookingDetails(bookingId: number) {
  const [booking] = await db
    .select({
      id: bookings.id,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      cancellationReason: bookings.cancellationReason,
      cancellationDate: bookings.cancellationDate,
      refundAmount: bookings.refundAmount,
      listingId: listings.id,
      listingTitle: listings.title,
      listingDescription: listings.description,
      listingCity: listings.city,
      listingAddress: listings.address,
      listingImage: listings.image,
      listingPricePerNight: listings.pricePerNight,
      listingCheckInInstructions: listings.checkInInstructions,
      listingHouseRules: listings.houseRules,
      listingLatitude: listings.latitude,
      listingLongitude: listings.longitude,
      listingPolicy: listings.cancellationPolicy,
      hostId: users.id,
      hostName: users.name,
      hostEmail: users.email,
      hostAvatar: users.avatar,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .innerJoin(users, eq(listings.hostId, users.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  if (!booking) return null

  return {
    id: booking.id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,
    status: booking.status,
    cancellationReason: booking.cancellationReason,
    cancellationDate: booking.cancellationDate,
    refundAmount: booking.refundAmount,
    listing: {
      id: booking.listingId,
      title: booking.listingTitle,
      description: booking.listingDescription,
      city: booking.listingCity,
      address: booking.listingAddress,
      image: booking.listingImage,
      pricePerNight: booking.listingPricePerNight,
      checkInInstructions: booking.listingCheckInInstructions,
      houseRules: booking.listingHouseRules,
      latitude: booking.listingLatitude,
      longitude: booking.listingLongitude,
      cancellationPolicy: booking.listingPolicy,
    },
    host: {
      id: booking.hostId,
      name: booking.hostName,
      email: booking.hostEmail,
      avatar: booking.hostAvatar,
    },
  }
}
