import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  city: text('city').notNull(),
  region: text('region'),
  country: text('country').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  imageUrl: text('image_url'),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  locationId: integer('location_id').references(() => locations.id).notNull(),
  pricePerNight: real('price_per_night').notNull(),
  maxGuests: integer('max_guests').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

export type Location = typeof locations.$inferSelect
export type NewLocation = typeof locations.$inferInsert
export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
