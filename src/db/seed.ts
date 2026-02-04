import { db } from './index'
import { users, listings, bookings, messages } from './schema'

async function seed() {
  // Clear existing data
  await db.delete(messages)
  await db.delete(bookings)
  await db.delete(listings)
  await db.delete(users)

  // Create users
  const [alice, bob, charlie] = await db.insert(users).values([
    { name: 'Alice Smith', email: 'alice@example.com', avatar: 'https://picsum.photos/seed/alice/200' },
    { name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://picsum.photos/seed/bob/200' },
    { name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://picsum.photos/seed/charlie/200' },
  ]).returning()

  // Create listings
  const [beachHouse, mountainCabin] = await db.insert(listings).values([
    {
      title: 'Beachfront Paradise',
      description: 'Beautiful beachfront property with stunning ocean views',
      image: 'https://picsum.photos/seed/beach/800/600',
      price: 250,
      hostId: alice.id,
    },
    {
      title: 'Cozy Mountain Cabin',
      description: 'Rustic cabin in the mountains with fireplace',
      image: 'https://picsum.photos/seed/cabin/800/600',
      price: 150,
      hostId: bob.id,
    },
  ]).returning()

  // Create a booking
  const checkIn = new Date('2026-03-01')
  const checkOut = new Date('2026-03-05')
  await db.insert(bookings).values({
    listingId: beachHouse.id,
    guestId: charlie.id,
    checkIn,
    checkOut,
  })

  // Create some messages
  await db.insert(messages).values([
    {
      senderId: charlie.id,
      receiverId: alice.id,
      listingId: beachHouse.id,
      content: 'Hi! I\'m interested in booking your beach house. Is it available in March?',
      isRead: true,
    },
    {
      senderId: alice.id,
      receiverId: charlie.id,
      listingId: beachHouse.id,
      content: 'Hi Charlie! Yes, it\'s available. The dates you mentioned work perfectly.',
      isRead: true,
    },
    {
      senderId: charlie.id,
      receiverId: alice.id,
      listingId: beachHouse.id,
      content: 'Great! I\'ll go ahead and book it. Looking forward to it!',
      isRead: false,
    },
    {
      senderId: bob.id,
      receiverId: charlie.id,
      listingId: mountainCabin.id,
      content: 'Hey Charlie, just wanted to let you know about a special discount on my cabin!',
      isRead: false,
    },
  ])

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
