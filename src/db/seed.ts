import { db } from './index'
import { users, listings, reservations } from './schema'

const now = new Date()
const hostId = 'host-1'
const guestIds = ['guest-1', 'guest-2', 'guest-3', 'guest-4', 'guest-5']

async function seed() {
  // Clear existing data
  await db.delete(reservations)
  await db.delete(listings)
  await db.delete(users)

  // Create host
  await db.insert(users).values({
    id: hostId,
    name: 'John Host',
    email: 'host@example.com',
    avatarUrl: 'https://picsum.photos/seed/host/100/100',
    isHost: true,
    createdAt: now,
  })

  // Create guests
  for (let i = 0; i < guestIds.length; i++) {
    await db.insert(users).values({
      id: guestIds[i],
      name: `Guest ${i + 1}`,
      email: `guest${i + 1}@example.com`,
      avatarUrl: `https://picsum.photos/seed/guest${i + 1}/100/100`,
      isHost: false,
      createdAt: now,
    })
  }

  // Create listings
  const listingData = [
    { id: 'listing-1', title: 'Cozy Downtown Apartment', price: 120, status: 'published' as const, rating: 4.8, reviewCount: 45, viewCount: 1250 },
    { id: 'listing-2', title: 'Beach House Paradise', price: 250, status: 'published' as const, rating: 4.9, reviewCount: 32, viewCount: 890 },
    { id: 'listing-3', title: 'Mountain Cabin Retreat', price: 180, status: 'paused' as const, rating: 4.7, reviewCount: 28, viewCount: 650 },
    { id: 'listing-4', title: 'Urban Loft Experience', price: 95, status: 'draft' as const, rating: null, reviewCount: 0, viewCount: 0 },
    { id: 'listing-5', title: 'Lakeside Villa', price: 350, status: 'published' as const, rating: 5.0, reviewCount: 18, viewCount: 420 },
  ]

  for (const listing of listingData) {
    await db.insert(listings).values({
      id: listing.id,
      hostId,
      title: listing.title,
      description: `A wonderful ${listing.title.toLowerCase()} perfect for your stay.`,
      coverImage: `https://picsum.photos/seed/${listing.id}/800/600`,
      pricePerNight: listing.price,
      status: listing.status,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      viewCount: listing.viewCount,
      location: 'San Francisco, CA',
      maxGuests: 4,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Create reservations with various dates and statuses
  const reservationData = [
    // Completed reservations over the past year
    { id: 'res-1', listingId: 'listing-1', guestId: 'guest-1', checkIn: -365, checkOut: -360, total: 600, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-2', listingId: 'listing-2', guestId: 'guest-2', checkIn: -330, checkOut: -325, total: 1250, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-3', listingId: 'listing-1', guestId: 'guest-3', checkIn: -300, checkOut: -297, total: 360, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-4', listingId: 'listing-5', guestId: 'guest-4', checkIn: -270, checkOut: -265, total: 1750, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-5', listingId: 'listing-2', guestId: 'guest-1', checkIn: -240, checkOut: -236, total: 1000, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-6', listingId: 'listing-1', guestId: 'guest-2', checkIn: -210, checkOut: -205, total: 600, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-7', listingId: 'listing-5', guestId: 'guest-3', checkIn: -180, checkOut: -174, total: 2100, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-8', listingId: 'listing-1', guestId: 'guest-4', checkIn: -150, checkOut: -147, total: 360, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-9', listingId: 'listing-2', guestId: 'guest-5', checkIn: -120, checkOut: -113, total: 1750, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-10', listingId: 'listing-1', guestId: 'guest-1', checkIn: -90, checkOut: -86, total: 480, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-11', listingId: 'listing-5', guestId: 'guest-2', checkIn: -60, checkOut: -55, total: 1750, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-12', listingId: 'listing-2', guestId: 'guest-3', checkIn: -30, checkOut: -26, total: 1000, status: 'completed' as const, payout: 'paid' as const },
    { id: 'res-13', listingId: 'listing-1', guestId: 'guest-4', checkIn: -15, checkOut: -12, total: 360, status: 'completed' as const, payout: 'processing' as const },
    // Current reservation
    { id: 'res-14', listingId: 'listing-2', guestId: 'guest-5', checkIn: -2, checkOut: 3, total: 1250, status: 'confirmed' as const, payout: 'pending' as const },
    // Upcoming reservations
    { id: 'res-15', listingId: 'listing-1', guestId: 'guest-1', checkIn: 7, checkOut: 10, total: 360, status: 'confirmed' as const, payout: 'pending' as const },
    { id: 'res-16', listingId: 'listing-5', guestId: 'guest-2', checkIn: 14, checkOut: 18, total: 1400, status: 'pending' as const, payout: 'pending' as const },
    // Cancelled reservation
    { id: 'res-17', listingId: 'listing-1', guestId: 'guest-3', checkIn: -45, checkOut: -42, total: 360, status: 'cancelled' as const, payout: 'pending' as const },
  ]

  for (const res of reservationData) {
    const checkIn = new Date(now.getTime() + res.checkIn * 24 * 60 * 60 * 1000)
    const checkOut = new Date(now.getTime() + res.checkOut * 24 * 60 * 60 * 1000)
    const nights = Math.abs(res.checkOut - res.checkIn)
    const serviceFee = res.total * 0.12
    const hostPayout = res.total - serviceFee

    await db.insert(reservations).values({
      id: res.id,
      listingId: res.listingId,
      guestId: res.guestId,
      checkIn,
      checkOut,
      guestsCount: Math.floor(Math.random() * 3) + 1,
      totalPrice: res.total,
      serviceFee,
      hostPayout,
      status: res.status,
      payoutStatus: res.payout,
      createdAt: new Date(checkIn.getTime() - 7 * 24 * 60 * 60 * 1000),
    })
  }

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
