import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  pricePerNight: real('price_per_night').notNull(),
  cleaningFee: real('cleaning_fee').notNull().default(0),
  maxGuests: integer('max_guests').notNull().default(1),
  minNights: integer('min_nights').notNull().default(1),
  imageUrl: text('image_url'),
  hostName: text('host_name'),
  location: text('location'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  guests: integer('guests').notNull(),
  totalPrice: real('total_price').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
