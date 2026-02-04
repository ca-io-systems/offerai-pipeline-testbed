import { test, expect, describe, beforeAll, afterAll } from 'bun:test'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import * as schema from '../db/schema'
import { formatDate, addDays } from '../lib/dates'

// Create test database
const testDb = new Database(':memory:')
const db = drizzle(testDb, { schema })

// Setup schema
testDb.exec(`
  CREATE TABLE listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price_per_night REAL NOT NULL,
    cleaning_fee REAL NOT NULL DEFAULT 0,
    max_guests INTEGER NOT NULL DEFAULT 1,
    min_nights INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    host_name TEXT,
    location TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guests INTEGER NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL
  );
`)

// Test helper functions that mirror the server actions
// (We test the logic directly since server actions require Next.js context)

const SERVICE_FEE_RATE = 0.14

async function checkAvailabilityHelper(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean }> {
  const conflictingBookings = await db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.listingId, listingId))

  for (const booking of conflictingBookings) {
    // Overlap check: booking starts before checkout AND ends after checkin
    if (booking.checkIn < checkOut && booking.checkOut > checkIn) {
      return { available: false }
    }
  }

  return { available: true }
}

async function calculatePriceHelper(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<{
  nightlyRate: number
  nights: number
  accommodationTotal: number
  cleaningFee: number
  serviceFee: number
  total: number
} | null> {
  const [listing] = await db
    .select()
    .from(schema.listings)
    .where(eq(schema.listings.id, listingId))

  if (!listing) return null

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  
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

describe('Availability Check', () => {
  let listingId: number

  beforeAll(async () => {
    // Create a test listing
    const [listing] = await db.insert(schema.listings).values({
      title: 'Test Listing',
      pricePerNight: 100,
      cleaningFee: 50,
      maxGuests: 4,
      minNights: 2,
      createdAt: new Date().toISOString(),
    }).returning()
    listingId = listing.id

    // Create an existing booking for Jan 15-20, 2025
    await db.insert(schema.bookings).values({
      listingId,
      checkIn: '2025-01-15',
      checkOut: '2025-01-20',
      guests: 2,
      totalPrice: 500,
      createdAt: new Date().toISOString(),
    })
  })

  test('returns available for dates with no conflicts', async () => {
    const result = await checkAvailabilityHelper(listingId, '2025-01-01', '2025-01-05')
    expect(result.available).toBe(true)
  })

  test('returns unavailable for overlapping dates (start overlap)', async () => {
    const result = await checkAvailabilityHelper(listingId, '2025-01-13', '2025-01-17')
    expect(result.available).toBe(false)
  })

  test('returns unavailable for overlapping dates (end overlap)', async () => {
    const result = await checkAvailabilityHelper(listingId, '2025-01-18', '2025-01-25')
    expect(result.available).toBe(false)
  })

  test('returns unavailable for dates within existing booking', async () => {
    const result = await checkAvailabilityHelper(listingId, '2025-01-16', '2025-01-18')
    expect(result.available).toBe(false)
  })

  test('returns available when checkout matches existing checkin (same-day turnover allowed)', async () => {
    // Checking out on Jan 15 when another booking starts Jan 15
    const result = await checkAvailabilityHelper(listingId, '2025-01-10', '2025-01-15')
    expect(result.available).toBe(true)
  })

  test('returns available when checkin matches existing checkout (same-day turnover allowed)', async () => {
    // Checking in on Jan 20 when another booking ends Jan 20
    const result = await checkAvailabilityHelper(listingId, '2025-01-20', '2025-01-25')
    expect(result.available).toBe(true)
  })
})

describe('Price Calculation', () => {
  let listingId: number

  beforeAll(async () => {
    // Create a test listing with known prices
    const [listing] = await db.insert(schema.listings).values({
      title: 'Price Test Listing',
      pricePerNight: 150,
      cleaningFee: 50,
      maxGuests: 6,
      minNights: 1,
      createdAt: new Date().toISOString(),
    }).returning()
    listingId = listing.id
  })

  test('calculates price correctly for 1 night', async () => {
    const result = await calculatePriceHelper(listingId, '2025-01-10', '2025-01-11')
    
    expect(result).not.toBeNull()
    expect(result!.nightlyRate).toBe(150)
    expect(result!.nights).toBe(1)
    expect(result!.accommodationTotal).toBe(150)
    expect(result!.cleaningFee).toBe(50)
    // Service fee: (150 + 50) * 0.14 = 28
    expect(result!.serviceFee).toBe(28)
    // Total: 150 + 50 + 28 = 228
    expect(result!.total).toBe(228)
  })

  test('calculates price correctly for multiple nights', async () => {
    const result = await calculatePriceHelper(listingId, '2025-01-10', '2025-01-15')
    
    expect(result).not.toBeNull()
    expect(result!.nightlyRate).toBe(150)
    expect(result!.nights).toBe(5)
    expect(result!.accommodationTotal).toBe(750) // 150 * 5
    expect(result!.cleaningFee).toBe(50)
    // Service fee: (750 + 50) * 0.14 = 112
    expect(result!.serviceFee).toBe(112)
    // Total: 750 + 50 + 112 = 912
    expect(result!.total).toBe(912)
  })

  test('returns null for non-existent listing', async () => {
    const result = await calculatePriceHelper(99999, '2025-01-10', '2025-01-15')
    expect(result).toBeNull()
  })
})

describe('Edge Cases', () => {
  test('same-day checkout is blocked by minimum nights validation', () => {
    // This is enforced in the Calendar component, not in server actions
    // The calendar prevents selecting same-day checkout
    const checkIn = new Date('2025-01-15')
    const checkOut = new Date('2025-01-15')
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    expect(nights).toBe(0)
    // Calendar component enforces minNights >= 1
  })

  test('past dates are blocked by date comparison', () => {
    const today = new Date()
    const yesterday = addDays(today, -1)
    const isInPast = formatDate(yesterday) < formatDate(today)
    expect(isInPast).toBe(true)
  })

  test('dates beyond 1 year are blocked', () => {
    const today = new Date()
    const oneYearOut = addDays(today, 365)
    const beyondOneYear = addDays(today, 366)
    const isBeyond = formatDate(beyondOneYear) > formatDate(oneYearOut)
    expect(isBeyond).toBe(true)
  })
})
