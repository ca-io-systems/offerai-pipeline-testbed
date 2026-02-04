import { test, expect, beforeAll } from 'bun:test'
import { db } from '@/db'
import { users, listings, listingPricing, seasonalPricing } from '@/db/schema'
import { getDatePrice, calculateBookingPrice, getSmartPricingSuggestion } from './pricing'

let testListingId: number

beforeAll(async () => {
  // Clear existing data
  await db.delete(listingPricing)
  await db.delete(seasonalPricing)
  await db.delete(listings)
  await db.delete(users)

  // Create test user
  const [user] = await db.insert(users).values({
    email: 'test@example.com',
    name: 'Test User',
  }).returning()

  // Create test listing
  const [listing] = await db.insert(listings).values({
    hostId: user.id,
    title: 'Test Listing',
    description: 'A test listing',
    location: 'Test City',
    basePrice: 100,
    weekendMultiplier: 1.2,
    defaultMinimumStay: 1,
  }).returning()

  testListingId = listing.id

  // Add per-date pricing override
  await db.insert(listingPricing).values({
    listingId: listing.id,
    date: '2025-06-15',
    price: 150,
    minimumStay: 2,
    isAvailable: true,
  })

  // Add blocked date
  await db.insert(listingPricing).values({
    listingId: listing.id,
    date: '2025-06-20',
    price: null,
    minimumStay: null,
    isAvailable: false,
  })

  // Add seasonal pricing
  await db.insert(seasonalPricing).values({
    listingId: listing.id,
    name: 'Summer Peak',
    startDate: '2025-07-01',
    endDate: '2025-08-31',
    multiplier: 1.5,
  })
})

test('getDatePrice returns base price for regular dates', async () => {
  const result = await getDatePrice(testListingId, '2025-06-10')
  expect(result.price).toBe(100)
  expect(result.isCustom).toBe(false)
  expect(result.isAvailable).toBe(true)
})

test('getDatePrice returns custom price for overridden dates', async () => {
  const result = await getDatePrice(testListingId, '2025-06-15')
  expect(result.price).toBe(150)
  expect(result.isCustom).toBe(true)
  expect(result.minimumStay).toBe(2)
  expect(result.isAvailable).toBe(true)
})

test('getDatePrice returns unavailable for blocked dates', async () => {
  const result = await getDatePrice(testListingId, '2025-06-20')
  expect(result.isAvailable).toBe(false)
})

test('getDatePrice applies weekend multiplier', async () => {
  // 2025-06-13 is a Friday
  const result = await getDatePrice(testListingId, '2025-06-13')
  expect(result.price).toBe(120) // 100 * 1.2
  expect(result.isWeekend).toBe(true)
  expect(result.isCustom).toBe(true)
})

test('getDatePrice applies seasonal multiplier', async () => {
  // 2025-07-15 is in Summer Peak season
  const result = await getDatePrice(testListingId, '2025-07-15')
  expect(result.price).toBe(150) // 100 * 1.5
  expect(result.seasonName).toBe('Summer Peak')
  expect(result.isCustom).toBe(true)
})

test('calculateBookingPrice calculates total correctly', async () => {
  // 2025-06-10 to 2025-06-12 = 2 nights at $100 each
  const result = await calculateBookingPrice(testListingId, '2025-06-10', '2025-06-12')
  expect(result.nights).toBe(2)
  expect(result.totalPrice).toBe(200)
  expect(result.averageNightlyPrice).toBe(100)
})

test('getSmartPricingSuggestion returns data', async () => {
  const result = await getSmartPricingSuggestion(testListingId)
  expect(result.averageAreaPrice).toBeDefined()
  expect(typeof result.similarListings).toBe('number')
})
