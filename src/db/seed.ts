import { db } from './index'
import { users, listings, bookings, reviews, hostResponses } from './schema'

async function seed() {
  // Clear existing data
  await db.delete(hostResponses)
  await db.delete(reviews)
  await db.delete(bookings)
  await db.delete(listings)
  await db.delete(users)

  // Create users
  const [host1] = await db.insert(users).values({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
  }).returning()

  const [host2] = await db.insert(users).values({
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatarUrl: 'https://picsum.photos/seed/mike/100/100',
  }).returning()

  const [guest1] = await db.insert(users).values({
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatarUrl: 'https://picsum.photos/seed/emily/100/100',
  }).returning()

  const [guest2] = await db.insert(users).values({
    name: 'James Wilson',
    email: 'james@example.com',
    avatarUrl: 'https://picsum.photos/seed/james/100/100',
  }).returning()

  const [guest3] = await db.insert(users).values({
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    avatarUrl: 'https://picsum.photos/seed/lisa/100/100',
  }).returning()

  // Create listings
  const [listing1] = await db.insert(listings).values({
    hostId: host1.id,
    title: 'Cozy Beach House',
    description: 'A beautiful beach house with ocean views and modern amenities.',
    location: 'Malibu, California',
    pricePerNight: 250,
    imageUrl: 'https://picsum.photos/seed/beach/800/600',
  }).returning()

  const [listing2] = await db.insert(listings).values({
    hostId: host1.id,
    title: 'Mountain Retreat Cabin',
    description: 'Rustic cabin in the mountains perfect for a peaceful getaway.',
    location: 'Aspen, Colorado',
    pricePerNight: 180,
    imageUrl: 'https://picsum.photos/seed/mountain/800/600',
  }).returning()

  const [listing3] = await db.insert(listings).values({
    hostId: host2.id,
    title: 'Downtown Loft',
    description: 'Modern loft in the heart of the city with skyline views.',
    location: 'New York, NY',
    pricePerNight: 300,
    imageUrl: 'https://picsum.photos/seed/loft/800/600',
  }).returning()

  // Create bookings
  const pastDate1 = new Date('2024-01-10')
  const pastDate2 = new Date('2024-01-15')
  const pastDate3 = new Date('2024-02-01')
  const pastDate4 = new Date('2024-02-05')
  const pastDate5 = new Date('2024-03-01')
  const pastDate6 = new Date('2024-03-07')

  const [booking1] = await db.insert(bookings).values({
    listingId: listing1.id,
    guestId: guest1.id,
    checkIn: pastDate1,
    checkOut: pastDate2,
    status: 'completed',
  }).returning()

  const [booking2] = await db.insert(bookings).values({
    listingId: listing1.id,
    guestId: guest2.id,
    checkIn: pastDate3,
    checkOut: pastDate4,
    status: 'completed',
  }).returning()

  const [booking3] = await db.insert(bookings).values({
    listingId: listing2.id,
    guestId: guest1.id,
    checkIn: pastDate5,
    checkOut: pastDate6,
    status: 'completed',
  }).returning()

  const [booking4] = await db.insert(bookings).values({
    listingId: listing3.id,
    guestId: guest3.id,
    checkIn: pastDate1,
    checkOut: pastDate2,
    status: 'completed',
  }).returning()

  // Booking without review (for testing review form)
  await db.insert(bookings).values({
    listingId: listing1.id,
    guestId: guest3.id,
    checkIn: new Date('2024-04-01'),
    checkOut: new Date('2024-04-05'),
    status: 'completed',
  })

  // Create reviews
  const [review1] = await db.insert(reviews).values({
    bookingId: booking1.id,
    listingId: listing1.id,
    guestId: guest1.id,
    overallRating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    checkinRating: 5,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 4,
    reviewText: 'Absolutely amazing stay! The beach house exceeded all our expectations. Sarah was an incredible host who made sure we had everything we needed. The views were breathtaking and the location was perfect. Would definitely stay here again!',
  }).returning()

  const [review2] = await db.insert(reviews).values({
    bookingId: booking2.id,
    listingId: listing1.id,
    guestId: guest2.id,
    overallRating: 4,
    cleanlinessRating: 4,
    accuracyRating: 4,
    checkinRating: 5,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 4,
    reviewText: 'Great beach house with stunning ocean views. Check-in was smooth and Sarah was very responsive. The house was clean and well-maintained. Only minor issue was the WiFi being a bit slow, but overall a fantastic experience.',
  }).returning()

  await db.insert(reviews).values({
    bookingId: booking3.id,
    listingId: listing2.id,
    guestId: guest1.id,
    overallRating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    checkinRating: 4,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 5,
    reviewText: 'The mountain cabin was exactly what we needed for a peaceful retreat. Surrounded by nature, cozy interior, and Sarah was always available for any questions. The hiking trails nearby were amazing!',
  })

  await db.insert(reviews).values({
    bookingId: booking4.id,
    listingId: listing3.id,
    guestId: guest3.id,
    overallRating: 4,
    cleanlinessRating: 5,
    accuracyRating: 4,
    checkinRating: 4,
    communicationRating: 4,
    locationRating: 5,
    valueRating: 3,
    reviewText: 'The downtown loft has an unbeatable location with amazing city views. Mike was helpful and the place was spotless. A bit pricey but worth it for the experience and convenience.',
  })

  // Create host responses
  await db.insert(hostResponses).values({
    reviewId: review1.id,
    hostId: host1.id,
    responseText: 'Thank you so much for the wonderful review, Emily! It was a pleasure hosting you and we hope to welcome you back soon!',
  })

  await db.insert(hostResponses).values({
    reviewId: review2.id,
    hostId: host1.id,
    responseText: 'Thank you for the feedback, James! We apologize for the WiFi issues and have since upgraded our internet service. Hope to see you again!',
  })

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
