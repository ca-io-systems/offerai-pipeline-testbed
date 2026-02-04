import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  phone: text('phone'),
  emergencyContact: text('emergency_contact'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  phoneVerified: integer('phone_verified', { mode: 'boolean' }).default(false),
  idVerified: integer('id_verified', { mode: 'boolean' }).default(false),
  responseRate: integer('response_rate').default(100),
  responseTime: text('response_time').default('within an hour'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  rating: real('rating'),
  reviewCount: integer('review_count').default(0),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => users.id),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
  checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull(),
  guestsCount: integer('guests_count').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  authorId: integer('author_id').notNull().references(() => users.id),
  targetUserId: integer('target_user_id').notNull().references(() => users.id),
  listingId: integer('listing_id').references(() => listings.id),
  rating: integer('rating').notNull(),
  text: text('text'),
  type: text('type').notNull(), // 'guest_to_host', 'host_to_guest'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
