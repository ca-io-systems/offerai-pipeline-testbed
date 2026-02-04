import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
  hostName: text('host_name').notNull(),
  isSuperhost: integer('is_superhost', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type Listing = typeof listings.$inferSelect
export type NewListing = typeof listings.$inferInsert
