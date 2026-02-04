import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const hosts = sqliteTable('hosts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  isSuperhost: integer('is_superhost', { mode: 'boolean' }).notNull().default(false),
  joinDate: text('join_date').notNull(),
  responseRate: integer('response_rate').notNull().default(100),
  responseTime: text('response_time').notNull().default('within an hour'),
})

export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  propertyType: text('property_type').notNull(),
  location: text('location').notNull(),
  pricePerNight: real('price_per_night').notNull(),
  cleaningFee: real('cleaning_fee').notNull(),
  serviceFee: real('service_fee').notNull(),
  guests: integer('guests').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  beds: integer('beds').notNull(),
  baths: integer('baths').notNull(),
  hostId: integer('host_id').notNull().references(() => hosts.id),
  avgRating: real('avg_rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
})

export const listingPhotos = sqliteTable('listing_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  url: text('url').notNull(),
  order: integer('order').notNull(),
})

export const amenities = sqliteTable('amenities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
})

export const listingAmenities = sqliteTable('listing_amenities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  amenityId: integer('amenity_id').notNull().references(() => amenities.id),
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: integer('listing_id').notNull().references(() => listings.id),
  authorName: text('author_name').notNull(),
  authorAvatarUrl: text('author_avatar_url').notNull(),
  date: text('date').notNull(),
  text: text('text').notNull(),
  rating: real('rating').notNull(),
  cleanliness: real('cleanliness').notNull(),
  accuracy: real('accuracy').notNull(),
  checkIn: real('check_in').notNull(),
  communication: real('communication').notNull(),
  location: real('location').notNull(),
  value: real('value').notNull(),
})

export type Host = typeof hosts.$inferSelect
export type Listing = typeof listings.$inferSelect
export type ListingPhoto = typeof listingPhotos.$inferSelect
export type Amenity = typeof amenities.$inferSelect
export type Review = typeof reviews.$inferSelect
