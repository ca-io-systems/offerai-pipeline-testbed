import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  pricePerNight: real('price_per_night').notNull(),
  propertyType: text('property_type').notNull(), // 'house', 'apartment', 'guesthouse', 'hotel'
  roomType: text('room_type').notNull(), // 'entire', 'private', 'shared'
  maxGuests: integer('max_guests').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  beds: integer('beds').notNull(),
  bathrooms: real('bathrooms').notNull(),
  amenities: text('amenities').notNull(), // JSON array of amenity strings
  images: text('images').notNull(), // JSON array of image URLs
  rating: real('rating'),
  reviewCount: integer('review_count').default(0),
  hostId: integer('host_id').notNull(),
  instantBook: integer('instant_book', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const hosts = sqliteTable('hosts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatar: text('avatar'),
  superhost: integer('superhost', { mode: 'boolean' }).default(false),
})

export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
export type Host = typeof hosts.$inferSelect
export type NewHost = typeof hosts.$inferInsert
