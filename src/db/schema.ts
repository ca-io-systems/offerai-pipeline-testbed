import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  isHost: integer('is_host', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  hostId: text('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  pricePerNight: real('price_per_night').notNull(),
  status: text('status', { enum: ['published', 'draft', 'paused'] }).notNull().default('draft'),
  rating: real('rating'),
  reviewCount: integer('review_count').default(0),
  viewCount: integer('view_count').default(0),
  location: text('location'),
  maxGuests: integer('max_guests').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const reservations = sqliteTable('reservations', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull().references(() => listings.id),
  guestId: text('guest_id').notNull().references(() => users.id),
  checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
  checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
  guestsCount: integer('guests_count').notNull().default(1),
  totalPrice: real('total_price').notNull(),
  serviceFee: real('service_fee').notNull().default(0),
  hostPayout: real('host_payout').notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled', 'completed'] }).notNull().default('pending'),
  payoutStatus: text('payout_status', { enum: ['pending', 'processing', 'paid'] }).notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export type User = typeof users.$inferSelect
export type Listing = typeof listings.$inferSelect
export type Reservation = typeof reservations.$inferSelect
