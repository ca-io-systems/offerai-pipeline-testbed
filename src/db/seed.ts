import { db } from './index'
import { users, listings, bookings, reviews } from './schema'
import type { NewUser, NewListing, NewBooking, NewReview } from './schema'

const seedUsers: NewUser[] = [
  {
    email: 'sarah@example.com',
    passwordHash: 'hashed_password_1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/user1/200/200',
    bio: 'Travel enthusiast and Superhost. I love meeting new people from around the world!',
    location: 'San Francisco, CA',
    phone: '+1 555-0101',
    emergencyContact: '+1 555-0102',
    emailVerified: true,
    phoneVerified: true,
    idVerified: true,
    responseRate: 100,
    responseTime: 'within an hour',
  },
  {
    email: 'michael@example.com',
    passwordHash: 'hashed_password_2',
    name: 'Michael Chen',
    avatarUrl: 'https://picsum.photos/seed/user2/200/200',
    bio: 'Foodie and adventure seeker. Ask me about the best local restaurants!',
    location: 'New York, NY',
    phone: '+1 555-0201',
    emailVerified: true,
    phoneVerified: true,
    idVerified: false,
    responseRate: 95,
    responseTime: 'within a few hours',
  },
  {
    email: 'emma@example.com',
    passwordHash: 'hashed_password_3',
    name: 'Emma Wilson',
    bio: 'Nature lover and photographer.',
    location: 'Seattle, WA',
    emailVerified: true,
    phoneVerified: false,
    idVerified: false,
    responseRate: 88,
    responseTime: 'within a day',
  },
  {
    email: 'guest@example.com',
    passwordHash: 'hashed_password_4',
    name: 'Guest User',
    location: 'Austin, TX',
    emailVerified: true,
    phoneVerified: false,
    idVerified: false,
  },
]

const categories = ['Beachfront', 'Cabins', 'Amazing pools', 'Countryside', 'Lakefront', 'Design', 'Castles']

async function seed() {
  // Clear existing data
  await db.delete(reviews)
  await db.delete(bookings)
  await db.delete(listings)
  await db.delete(users)

  // Seed users
  const insertedUsers = await db.insert(users).values(seedUsers).returning()
  console.log(`Seeded ${insertedUsers.length} users`)

  // Seed listings for hosts (Sarah, Michael, Emma)
  const listingsData: NewListing[] = []
  const hosts = insertedUsers.slice(0, 3)

  for (let i = 0; i < 15; i++) {
    const host = hosts[i % 3]
    const category = categories[i % categories.length]
    listingsData.push({
      hostId: host.id,
      title: `Beautiful ${category} Property ${i + 1}`,
      description: `Amazing ${category.toLowerCase()} property with stunning views.`,
      location: `${host.location}`,
      city: host.location?.split(',')[0] || 'City',
      country: 'United States',
      pricePerNight: 100 + Math.floor(Math.random() * 300),
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: 5 + Math.floor(Math.random() * 50),
      imageUrl: `https://picsum.photos/seed/listing${i + 1}/400/300`,
      category,
    })
  }

  const insertedListings = await db.insert(listings).values(listingsData).returning()
  console.log(`Seeded ${insertedListings.length} listings`)

  // Seed bookings
  const guest = insertedUsers[3] // guest@example.com
  const bookingsData: NewBooking[] = []
  
  for (let i = 0; i < 5; i++) {
    const listing = insertedListings[i]
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() - 30 - i * 10)
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkOut.getDate() + 3 + Math.floor(Math.random() * 4))
    
    bookingsData.push({
      guestId: guest.id,
      listingId: listing.id,
      checkIn,
      checkOut,
      totalPrice: listing.pricePerNight * 4,
      status: 'completed',
      guestsCount: 2,
    })
  }

  const insertedBookings = await db.insert(bookings).values(bookingsData).returning()
  console.log(`Seeded ${insertedBookings.length} bookings`)

  // Seed reviews
  const reviewsData: NewReview[] = []
  
  for (let i = 0; i < insertedBookings.length; i++) {
    const booking = insertedBookings[i]
    const listing = insertedListings[i]
    
    // Guest reviewing host
    reviewsData.push({
      bookingId: booking.id,
      authorId: guest.id,
      targetUserId: listing.hostId,
      listingId: listing.id,
      rating: 4 + Math.floor(Math.random() * 2),
      text: 'Great stay! The host was very accommodating and the place was exactly as described.',
      type: 'guest_to_host',
    })
    
    // Host reviewing guest
    reviewsData.push({
      bookingId: booking.id,
      authorId: listing.hostId,
      targetUserId: guest.id,
      listingId: listing.id,
      rating: 5,
      text: 'Wonderful guest! Very respectful and left the place in great condition.',
      type: 'host_to_guest',
    })
  }

  const insertedReviews = await db.insert(reviews).values(reviewsData).returning()
  console.log(`Seeded ${insertedReviews.length} reviews`)

  console.log('Database seeded successfully!')
}

seed()
