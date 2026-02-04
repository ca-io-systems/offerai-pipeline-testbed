import { db } from './index'
import { listings, bookings } from './schema'

async function seed() {
  // Clear existing data
  await db.delete(bookings)
  await db.delete(listings)

  // Insert sample listings
  const [listing1] = await db.insert(listings).values({
    title: 'Cozy Beach House',
    description: 'A beautiful beach house with ocean views',
    pricePerNight: 150,
    cleaningFee: 50,
    maxGuests: 6,
    minNights: 2,
    imageUrl: 'https://picsum.photos/seed/beach/800/600',
    hostName: 'Sarah',
    location: 'Malibu, California',
  }).returning()

  const [listing2] = await db.insert(listings).values({
    title: 'Mountain Cabin Retreat',
    description: 'Rustic cabin in the mountains',
    pricePerNight: 120,
    cleaningFee: 30,
    maxGuests: 4,
    minNights: 1,
    imageUrl: 'https://picsum.photos/seed/cabin/800/600',
    hostName: 'Mike',
    location: 'Aspen, Colorado',
  }).returning()

  // Insert some existing bookings to test availability
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekEnd = new Date(nextWeek)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 3)

  await db.insert(bookings).values({
    listingId: listing1.id,
    checkIn: nextWeek.toISOString().split('T')[0],
    checkOut: nextWeekEnd.toISOString().split('T')[0],
    guests: 4,
    totalPrice: 550,
  })

  console.log('Database seeded successfully!')
  console.log(`Created listing 1: ${listing1.title} (ID: ${listing1.id})`)
  console.log(`Created listing 2: ${listing2.title} (ID: ${listing2.id})`)
}

seed().catch(console.error)
