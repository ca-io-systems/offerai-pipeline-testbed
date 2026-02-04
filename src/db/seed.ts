import { db } from './index'
import { users, listings, bookings, reviews, reports } from './schema'

// Clear existing data
await db.delete(reports)
await db.delete(reviews)
await db.delete(bookings)
await db.delete(listings)
await db.delete(users)

// Seed users (including admin)
const now = new Date()
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

const seededUsers = await db.insert(users).values([
  {
    name: 'Admin User',
    email: 'admin@offerbnb.com',
    passwordHash: 'hashed_password_admin',
    isAdmin: true,
    createdAt: threeMonthsAgo,
  },
  {
    name: 'John Host',
    email: 'john@example.com',
    passwordHash: 'hashed_password_1',
    avatarUrl: 'https://picsum.photos/seed/user1/200',
    createdAt: twoMonthsAgo,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHash: 'hashed_password_2',
    avatarUrl: 'https://picsum.photos/seed/user2/200',
    createdAt: twoMonthsAgo,
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    passwordHash: 'hashed_password_3',
    avatarUrl: 'https://picsum.photos/seed/user3/200',
    createdAt: oneMonthAgo,
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: 'hashed_password_4',
    avatarUrl: 'https://picsum.photos/seed/user4/200',
    createdAt: oneMonthAgo,
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    passwordHash: 'hashed_password_5',
    avatarUrl: 'https://picsum.photos/seed/user5/200',
    createdAt: now,
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    passwordHash: 'hashed_password_6',
    avatarUrl: 'https://picsum.photos/seed/user6/200',
    createdAt: now,
  },
  {
    name: 'Eve Adams',
    email: 'eve@example.com',
    passwordHash: 'hashed_password_7',
    avatarUrl: 'https://picsum.photos/seed/user7/200',
    isSuspended: true,
    createdAt: threeMonthsAgo,
  },
]).returning()

const cities = ['New York', 'Los Angeles', 'San Francisco', 'Miami', 'Chicago', 'Seattle', 'Austin', 'Boston']

// Seed listings
const seededListings = await db.insert(listings).values([
  {
    title: 'Cozy Downtown Apartment',
    description: 'A beautiful apartment in the heart of downtown.',
    city: 'New York',
    address: '123 Main St',
    price: 150,
    imageUrl: 'https://picsum.photos/seed/listing1/800/600',
    hostId: seededUsers[1].id,
    status: 'approved',
    rating: 4.5,
    reviewCount: 12,
    createdAt: twoMonthsAgo,
  },
  {
    title: 'Beach House Paradise',
    description: 'Stunning beach house with ocean views.',
    city: 'Miami',
    address: '456 Ocean Blvd',
    price: 300,
    imageUrl: 'https://picsum.photos/seed/listing2/800/600',
    hostId: seededUsers[1].id,
    status: 'approved',
    rating: 4.8,
    reviewCount: 25,
    createdAt: twoMonthsAgo,
  },
  {
    title: 'Mountain Retreat',
    description: 'Peaceful cabin in the mountains.',
    city: 'Seattle',
    address: '789 Mountain Rd',
    price: 200,
    imageUrl: 'https://picsum.photos/seed/listing3/800/600',
    hostId: seededUsers[2].id,
    status: 'approved',
    rating: 4.2,
    reviewCount: 8,
    createdAt: oneMonthAgo,
  },
  {
    title: 'Modern Loft Space',
    description: 'Stylish loft in the arts district.',
    city: 'Los Angeles',
    address: '321 Art St',
    price: 175,
    imageUrl: 'https://picsum.photos/seed/listing4/800/600',
    hostId: seededUsers[3].id,
    status: 'approved',
    rating: 4.6,
    reviewCount: 15,
    createdAt: oneMonthAgo,
  },
  {
    title: 'Historic Brownstone',
    description: 'Charming brownstone with modern amenities.',
    city: 'Boston',
    address: '555 Heritage Ave',
    price: 225,
    imageUrl: 'https://picsum.photos/seed/listing5/800/600',
    hostId: seededUsers[2].id,
    status: 'approved',
    rating: 4.4,
    reviewCount: 10,
    createdAt: oneMonthAgo,
  },
  {
    title: 'Lakefront Cottage',
    description: 'Peaceful cottage by the lake.',
    city: 'Chicago',
    address: '777 Lake Dr',
    price: 180,
    imageUrl: 'https://picsum.photos/seed/listing6/800/600',
    hostId: seededUsers[4].id,
    status: 'pending',
    createdAt: now,
  },
  {
    title: 'Urban Studio',
    description: 'Compact but comfortable studio apartment.',
    city: 'San Francisco',
    address: '888 Tech Blvd',
    price: 120,
    imageUrl: 'https://picsum.photos/seed/listing7/800/600',
    hostId: seededUsers[5].id,
    status: 'pending',
    createdAt: now,
  },
  {
    title: 'Luxury Penthouse',
    description: 'Exclusive penthouse with city views.',
    city: 'Austin',
    address: '999 High St',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/listing8/800/600',
    hostId: seededUsers[1].id,
    status: 'suspended',
    isFlagged: true,
    rating: 3.5,
    reviewCount: 3,
    createdAt: twoMonthsAgo,
  },
]).returning()

// Seed bookings - spread across different months for charts
const bookingDates = [
  { offset: 90, status: 'completed' as const },
  { offset: 85, status: 'completed' as const },
  { offset: 75, status: 'completed' as const },
  { offset: 60, status: 'completed' as const },
  { offset: 55, status: 'completed' as const },
  { offset: 50, status: 'completed' as const },
  { offset: 45, status: 'completed' as const },
  { offset: 30, status: 'completed' as const },
  { offset: 25, status: 'completed' as const },
  { offset: 20, status: 'confirmed' as const },
  { offset: 15, status: 'confirmed' as const },
  { offset: 10, status: 'confirmed' as const },
  { offset: 5, status: 'pending' as const },
  { offset: 2, status: 'pending' as const },
]

const seededBookings = await db.insert(bookings).values(
  bookingDates.map((b, i) => ({
    listingId: seededListings[i % 5].id,
    guestId: seededUsers[(i % 5) + 2].id,
    checkIn: new Date(now.getTime() - b.offset * 24 * 60 * 60 * 1000),
    checkOut: new Date(now.getTime() - (b.offset - 3) * 24 * 60 * 60 * 1000),
    totalPrice: seededListings[i % 5].price * 3,
    status: b.status,
    createdAt: new Date(now.getTime() - b.offset * 24 * 60 * 60 * 1000),
  }))
).returning()

// Seed reviews
await db.insert(reviews).values([
  {
    listingId: seededListings[0].id,
    userId: seededUsers[3].id,
    rating: 5,
    comment: 'Amazing place, will definitely come back!',
    createdAt: oneMonthAgo,
  },
  {
    listingId: seededListings[1].id,
    userId: seededUsers[4].id,
    rating: 4,
    comment: 'Great location, but a bit noisy.',
    createdAt: oneMonthAgo,
  },
  {
    listingId: seededListings[2].id,
    userId: seededUsers[5].id,
    rating: 5,
    comment: 'Perfect mountain getaway!',
    createdAt: now,
  },
])

// Seed reports
await db.insert(reports).values([
  {
    reporterId: seededUsers[3].id,
    listingId: seededListings[7].id,
    reason: 'Misleading photos',
    description: 'The photos do not match the actual property.',
    status: 'pending',
    createdAt: oneMonthAgo,
  },
  {
    reporterId: seededUsers[4].id,
    listingId: seededListings[7].id,
    reason: 'Safety concerns',
    description: 'The property has broken fire alarms.',
    status: 'pending',
    createdAt: now,
  },
  {
    reporterId: seededUsers[5].id,
    listingId: seededListings[0].id,
    reason: 'Spam listing',
    description: 'Duplicate listing from the same host.',
    status: 'dismissed',
    createdAt: twoMonthsAgo,
  },
])

console.log('Database seeded successfully!')
console.log(`  - ${seededUsers.length} users (including admin@offerbnb.com)`)
console.log(`  - ${seededListings.length} listings`)
console.log(`  - ${seededBookings.length} bookings`)
console.log('  - 3 reviews')
console.log('  - 3 reports')
