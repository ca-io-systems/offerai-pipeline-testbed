import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  hostId: text('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  propertyType: text('property_type').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  imageUrl: text('image_url').notNull(),
  pricePerNight: real('price_per_night').notNull(),
  cleaningFee: real('cleaning_fee').notNull().default(0),
  serviceFee: real('service_fee').notNull().default(0),
  rating: real('rating'),
  reviewCount: integer('review_count').default(0),
  maxGuests: integer('max_guests').notNull().default(4),
  bedrooms: integer('bedrooms').notNull().default(1),
  beds: integer('beds').notNull().default(1),
  bathrooms: integer('bathrooms').notNull().default(1),
  houseRules: text('house_rules'),
  cancellationPolicy: text('cancellation_policy').notNull().default('moderate'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull().references(() => listings.id),
  guestId: text('guest_id').notNull().references(() => users.id),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  guests: integer('guests').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('confirmed'),
  referenceNumber: text('reference_number').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  bookingId: text('booking_id').references(() => bookings.id),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
