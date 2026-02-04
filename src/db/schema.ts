import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  hostId: text('host_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  pricePerNight: integer('price_per_night').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull().references(() => listings.id),
  guestId: text('guest_id').notNull().references(() => users.id),
  hostId: text('host_id').notNull().references(() => users.id),
  checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
  checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => bookings.id),
  authorId: text('author_id').notNull().references(() => users.id),
  recipientId: text('recipient_id').notNull().references(() => users.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id),
  recipientId: text('recipient_id').notNull().references(() => users.id),
  bookingId: text('booking_id').references(() => bookings.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const notificationTypes = [
  'booking_confirmed',
  'booking_request',
  'booking_cancelled',
  'review_received',
  'message_received',
  'listing_published',
  'price_change',
] as const

export type NotificationType = typeof notificationTypes[number]

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: notificationTypes }).notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  linkUrl: text('link_url'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const notificationPreferences = sqliteTable('notification_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  bookingConfirmedInApp: integer('booking_confirmed_in_app', { mode: 'boolean' }).notNull().default(true),
  bookingConfirmedEmail: integer('booking_confirmed_email', { mode: 'boolean' }).notNull().default(true),
  bookingRequestInApp: integer('booking_request_in_app', { mode: 'boolean' }).notNull().default(true),
  bookingRequestEmail: integer('booking_request_email', { mode: 'boolean' }).notNull().default(true),
  bookingCancelledInApp: integer('booking_cancelled_in_app', { mode: 'boolean' }).notNull().default(true),
  bookingCancelledEmail: integer('booking_cancelled_email', { mode: 'boolean' }).notNull().default(true),
  reviewReceivedInApp: integer('review_received_in_app', { mode: 'boolean' }).notNull().default(true),
  reviewReceivedEmail: integer('review_received_email', { mode: 'boolean' }).notNull().default(true),
  messageReceivedInApp: integer('message_received_in_app', { mode: 'boolean' }).notNull().default(true),
  messageReceivedEmail: integer('message_received_email', { mode: 'boolean' }).notNull().default(true),
  listingPublishedInApp: integer('listing_published_in_app', { mode: 'boolean' }).notNull().default(true),
  listingPublishedEmail: integer('listing_published_email', { mode: 'boolean' }).notNull().default(true),
  priceChangeInApp: integer('price_change_in_app', { mode: 'boolean' }).notNull().default(true),
  priceChangeEmail: integer('price_change_email', { mode: 'boolean' }).notNull().default(true),
})

export type User = typeof users.$inferSelect
export type Listing = typeof listings.$inferSelect
export type Booking = typeof bookings.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Message = typeof messages.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type NotificationPreference = typeof notificationPreferences.$inferSelect
