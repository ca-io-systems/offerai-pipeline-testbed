import { db } from './index'
import { users, listings, bookings, reviews } from './schema'

async function seed() {
  // Clear existing data
  await db.delete(reviews)
  await db.delete(bookings)
  await db.delete(listings)
  await db.delete(users)

  // Create users
  const [host1] = await db.insert(users).values({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://picsum.photos/seed/host1/100/100',
  }).returning()

  const [host2] = await db.insert(users).values({
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://picsum.photos/seed/host2/100/100',
  }).returning()

  const [guest] = await db.insert(users).values({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://picsum.photos/seed/guest1/100/100',
  }).returning()

  // Create listings
  const [listing1] = await db.insert(listings).values({
    hostId: host1.id,
    title: 'Cozy Beach House',
    description: 'A beautiful beach house with stunning ocean views.',
    city: 'Malibu',
    address: '123 Ocean Drive, Malibu, CA 90265',
    image: 'https://picsum.photos/seed/listing1/800/600',
    pricePerNight: 250,
    checkInInstructions: 'Check-in after 3 PM. Key is in the lockbox by the front door. Code: 1234',
    houseRules: 'No smoking. No parties. Quiet hours 10 PM - 8 AM.',
    latitude: 34.0259,
    longitude: -118.7798,
    cancellationPolicy: 'moderate',
  }).returning()

  const [listing2] = await db.insert(listings).values({
    hostId: host2.id,
    title: 'Downtown Loft',
    description: 'Modern loft in the heart of the city.',
    city: 'New York',
    address: '456 Broadway, New York, NY 10012',
    image: 'https://picsum.photos/seed/listing2/800/600',
    pricePerNight: 180,
    checkInInstructions: 'Meet at lobby. Doorman will give you the key.',
    houseRules: 'No pets. Keep noise to a minimum.',
    latitude: 40.7223,
    longitude: -73.9987,
    cancellationPolicy: 'flexible',
  }).returning()

  const [listing3] = await db.insert(listings).values({
    hostId: host1.id,
    title: 'Mountain Retreat',
    description: 'Peaceful cabin in the mountains.',
    city: 'Aspen',
    address: '789 Mountain Road, Aspen, CO 81611',
    image: 'https://picsum.photos/seed/listing3/800/600',
    pricePerNight: 320,
    checkInInstructions: 'Self check-in. Code for smart lock will be sent 24h before arrival.',
    houseRules: 'No smoking indoors. Firewood available in shed.',
    latitude: 39.1911,
    longitude: -106.8175,
    cancellationPolicy: 'strict',
  }).returning()

  // Create bookings
  const today = new Date()
  
  // Upcoming booking - confirmed
  await db.insert(bookings).values({
    guestId: guest.id,
    listingId: listing1.id,
    checkIn: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPrice: 1250,
    status: 'confirmed',
  })

  // Upcoming booking - pending
  await db.insert(bookings).values({
    guestId: guest.id,
    listingId: listing2.id,
    checkIn: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(today.getTime() + 33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPrice: 540,
    status: 'pending',
  })

  // Past booking - completed with review
  const [pastBooking1] = await db.insert(bookings).values({
    guestId: guest.id,
    listingId: listing1.id,
    checkIn: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPrice: 1250,
    status: 'completed',
  }).returning()

  await db.insert(reviews).values({
    bookingId: pastBooking1.id,
    guestId: guest.id,
    listingId: listing1.id,
    rating: 5,
    comment: 'Amazing stay! The views were incredible.',
  })

  // Past booking - completed without review
  await db.insert(bookings).values({
    guestId: guest.id,
    listingId: listing3.id,
    checkIn: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(today.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPrice: 1600,
    status: 'completed',
  })

  // Cancelled booking
  await db.insert(bookings).values({
    guestId: guest.id,
    listingId: listing2.id,
    checkIn: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPrice: 540,
    status: 'cancelled',
    cancellationReason: 'Change of plans',
    cancellationDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    refundAmount: 432,
  })

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
