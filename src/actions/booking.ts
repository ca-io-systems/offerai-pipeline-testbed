'use server'

import { db } from '@/db'
import { bookings, listings } from '@/db/schema'
import { eq, and, or, lt, gt } from 'drizzle-orm'
import { daysBetween, formatDate, addDays } from '@/lib/dates'

const SERVICE_FEE_RATE = 0.14

export interface AvailabilityResult {
  available: boolean
  suggestedDates?: {
    checkIn: string
    checkOut: string
  }[]
}

export interface PriceBreakdown {
  nightlyRate: number
  nights: number
  accommodationTotal: number
  cleaningFee: number
  serviceFee: number
  total: number
}

export async function checkAvailability(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResult> {
  // Find any overlapping bookings
  const conflictingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
        // Overlap: existing booking starts before our checkout AND ends after our checkin
        lt(bookings.checkIn, checkOut),
        gt(bookings.checkOut, checkIn)
      )
    )

  if (conflictingBookings.length === 0) {
    return { available: true }
  }

  // Find suggested dates if not available
  const suggestedDates = await findNearbyAvailableDates(listingId, checkIn, checkOut)

  return {
    available: false,
    suggestedDates,
  }
}

async function findNearbyAvailableDates(
  listingId: number,
  requestedCheckIn: string,
  requestedCheckOut: string
): Promise<{ checkIn: string; checkOut: string }[]> {
  const requestedNights = daysBetween(new Date(requestedCheckIn), new Date(requestedCheckOut))
  const suggestions: { checkIn: string; checkOut: string }[] = []

  // Get all bookings for this listing in the next 60 days
  const today = new Date()
  const futureLimit = addDays(today, 60)

  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
        gt(bookings.checkOut, formatDate(today)),
        lt(bookings.checkIn, formatDate(futureLimit))
      )
    )

  // Sort by check-in date
  existingBookings.sort((a, b) => a.checkIn.localeCompare(b.checkIn))

  // Find gaps between bookings
  let searchStart = today
  
  for (const booking of existingBookings) {
    const bookingStart = new Date(booking.checkIn)
    const gap = daysBetween(searchStart, bookingStart)
    
    if (gap >= requestedNights) {
      const suggestedCheckIn = formatDate(searchStart)
      const suggestedCheckOut = formatDate(addDays(searchStart, requestedNights))
      suggestions.push({ checkIn: suggestedCheckIn, checkOut: suggestedCheckOut })
      
      if (suggestions.length >= 3) break
    }
    
    searchStart = new Date(booking.checkOut)
  }

  // Check after last booking
  if (suggestions.length < 3) {
    const lastDate = existingBookings.length > 0
      ? new Date(existingBookings[existingBookings.length - 1].checkOut)
      : today

    if (daysBetween(lastDate, futureLimit) >= requestedNights) {
      suggestions.push({
        checkIn: formatDate(lastDate),
        checkOut: formatDate(addDays(lastDate, requestedNights)),
      })
    }
  }

  return suggestions
}

export async function calculatePrice(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<PriceBreakdown | null> {
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))

  if (!listing) return null

  const nights = daysBetween(new Date(checkIn), new Date(checkOut))
  const accommodationTotal = listing.pricePerNight * nights
  const subtotal = accommodationTotal + listing.cleaningFee
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100
  const total = Math.round((subtotal + serviceFee) * 100) / 100

  return {
    nightlyRate: listing.pricePerNight,
    nights,
    accommodationTotal,
    cleaningFee: listing.cleaningFee,
    serviceFee,
    total,
  }
}

export async function getBlockedDates(listingId: number): Promise<{ start: string; end: string }[]> {
  const today = formatDate(new Date())
  const oneYearOut = formatDate(addDays(new Date(), 365))

  const existingBookings = await db
    .select({
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
        gt(bookings.checkOut, today),
        lt(bookings.checkIn, oneYearOut)
      )
    )

  return existingBookings.map(b => ({
    start: b.checkIn,
    end: b.checkOut,
  }))
}

export async function getListing(listingId: number) {
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))

  return listing || null
}
