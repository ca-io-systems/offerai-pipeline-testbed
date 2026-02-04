import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  basePrice: real('base_price').notNull(),
  weekendMultiplier: real('weekend_multiplier').notNull().default(1.0),
  defaultMinimumStay: integer('default_minimum_stay').notNull().default(1),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const listingPricing = sqliteTable('listing_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  date: text('date').notNull(),
  price: real('price'),
  minimumStay: integer('minimum_stay'),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
})

export const seasonalPricing = sqliteTable('seasonal_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  name: text('name').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  multiplier: real('multiplier').notNull(),
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  guestId: integer('guest_id').notNull().references(() => users.id),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
export type ListingPricing = typeof listingPricing.$inferSelect
export type NewListingPricing = typeof listingPricing.$inferInsert
export type SeasonalPricing = typeof seasonalPricing.$inferSelect
export type NewSeasonalPricing = typeof seasonalPricing.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
