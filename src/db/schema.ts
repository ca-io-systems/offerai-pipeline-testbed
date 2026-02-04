import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon').notNull(),
})

export const amenityCategories = sqliteTable('amenity_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
})

export const amenities = sqliteTable('amenities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull(),
  categoryId: integer('category_id').references(() => amenityCategories.id),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  pricePerNight: real('price_per_night').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  categoryId: integer('category_id').references(() => categories.id),
  guests: integer('guests').default(2),
  bedrooms: integer('bedrooms').default(1),
  beds: integer('beds').default(1),
  bathrooms: integer('bathrooms').default(1),
  rating: real('rating'),
  reviewCount: integer('review_count').default(0),
})

export const listingAmenities = sqliteTable('listing_amenities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  amenityId: integer('amenity_id').notNull().references(() => amenities.id),
})

export type Category = typeof categories.$inferSelect
export type Amenity = typeof amenities.$inferSelect
export type AmenityCategory = typeof amenityCategories.$inferSelect
export type Listing = typeof listings.$inferSelect
export type ListingAmenity = typeof listingAmenities.$inferSelect
