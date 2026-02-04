'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { bookings, notifications, listings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth'
import { generateId, generateReferenceNumber, calculateNights } from '@/lib/utils'

export interface CreateBookingData {
  listingId: string
  checkIn: string
  checkOut: string
  guests: number
  cardNumber: string
  expiration: string
  cvv: string
  billingAddress: string
  billingCity: string
  billingZip: string
  billingCountry: string
  agreeToRules: boolean
}

export async function createBooking(data: CreateBookingData) {
  const user = await requireAuth()

  if (!data.agreeToRules) {
    return { error: 'You must agree to the house rules' }
  }

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, data.listingId),
  })

  if (!listing) {
    return { error: 'Listing not found' }
  }

  const nights = calculateNights(data.checkIn, data.checkOut)
  const accommodationTotal = listing.pricePerNight * nights
  const totalPrice = accommodationTotal + listing.cleaningFee + listing.serviceFee

  const bookingId = generateId()
  const referenceNumber = generateReferenceNumber()

  await db.insert(bookings).values({
    id: bookingId,
    listingId: data.listingId,
    guestId: user.id,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guests: data.guests,
    totalPrice,
    status: 'confirmed',
    referenceNumber,
  })

  const notificationId = generateId()
  await db.insert(notifications).values({
    id: notificationId,
    userId: listing.hostId,
    type: 'new_booking',
    title: 'New Booking',
    message: `${user.name} has booked ${listing.title} from ${data.checkIn} to ${data.checkOut}.`,
    bookingId,
  })

  redirect(`/bookings/${bookingId}/confirmation`)
}
