import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hostId: integer("host_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(),
  roomType: text("room_type").notNull(),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  beds: integer("beds").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  cleaningFee: real("cleaning_fee").notNull(),
  serviceFee: real("service_fee").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  address: text("address").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const listingImages = sqliteTable("listing_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  url: text("url").notNull(),
  caption: text("caption"),
  order: integer("order").notNull(),
});

export const amenities = sqliteTable("amenities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  category: text("category"),
});

export const listingAmenities = sqliteTable("listing_amenities", {
  listingId: integer("listing_id").notNull().references(() => listings.id),
  amenityId: integer("amenity_id").notNull().references(() => amenities.id),
}, (table) => [
  primaryKey({ columns: [table.listingId, table.amenityId] }),
]);

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  slug: text("slug").notNull().unique(),
});

export const listingCategories = sqliteTable("listing_categories", {
  listingId: integer("listing_id").notNull().references(() => listings.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
}, (table) => [
  primaryKey({ columns: [table.listingId, table.categoryId] }),
]);

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestId: integer("guest_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  checkIn: integer("check_in", { mode: "timestamp" }).notNull(),
  checkOut: integer("check_out", { mode: "timestamp" }).notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull(),
  guestsCount: integer("guests_count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  rating: integer("rating").notNull(),
  cleanliness: integer("cleanliness").notNull(),
  accuracy: integer("accuracy").notNull(),
  checkIn: integer("check_in_rating").notNull(),
  communication: integer("communication").notNull(),
  location: integer("location").notNull(),
  value: integer("value").notNull(),
  text: text("text"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const reviewResponses = sqliteTable("review_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").notNull().references(() => reviews.id),
  hostId: integer("host_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  listingId: integer("listing_id").references(() => listings.id),
  text: text("text").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const wishlists = sqliteTable("wishlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const wishlistItems = sqliteTable("wishlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wishlistId: integer("wishlist_id").notNull().references(() => wishlists.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  relatedId: integer("related_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
