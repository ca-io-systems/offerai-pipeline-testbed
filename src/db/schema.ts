import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  image: text('image').notNull(),
  pricePerNight: real('price_per_night').notNull(),
  checkInInstructions: text('check_in_instructions'),
  houseRules: text('house_rules'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  cancellationPolicy: text('cancellation_policy').notNull().default('moderate'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => users.id),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('pending'),
  cancellationReason: text('cancellation_reason'),
  cancellationDate: text('cancellation_date'),
  refundAmount: real('refund_amount'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  guestId: integer('guest_id').notNull().references(() => users.id),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export type User = typeof users.$inferSelect
export type Listing = typeof listings.$inferSelect
export type Booking = typeof bookings.$inferSelect
export type Review = typeof reviews.$inferSelect
