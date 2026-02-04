import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  guestId: integer('guest_id').notNull().references(() => users.id),
  checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
  checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'completed', 'cancelled'] }).notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id).unique(),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  guestId: integer('guest_id').notNull().references(() => users.id),
  overallRating: integer('overall_rating').notNull(),
  cleanlinessRating: integer('cleanliness_rating').notNull(),
  accuracyRating: integer('accuracy_rating').notNull(),
  checkinRating: integer('checkin_rating').notNull(),
  communicationRating: integer('communication_rating').notNull(),
  locationRating: integer('location_rating').notNull(),
  valueRating: integer('value_rating').notNull(),
  reviewText: text('review_text').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const hostResponses = sqliteTable('host_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  reviewId: integer('review_id').notNull().references(() => reviews.id).unique(),
  hostId: integer('host_id').notNull().references(() => users.id),
  responseText: text('response_text').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export type User = typeof users.$inferSelect
export type Listing = typeof listings.$inferSelect
export type Booking = typeof bookings.$inferSelect
export type Review = typeof reviews.$inferSelect
export type HostResponse = typeof hostResponses.$inferSelect
