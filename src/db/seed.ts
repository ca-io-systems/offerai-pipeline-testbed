import { db } from './index'
import { users, listings, listingPricing, seasonalPricing, bookings } from './schema'

async function seed() {
  // Clear existing data
  await db.delete(bookings)
  await db.delete(listingPricing)
  await db.delete(seasonalPricing)
  await db.delete(listings)
  await db.delete(users)

  // Create users
  const [host1] = await db.insert(users).values([
    { email: 'host@example.com', name: 'John Host', avatarUrl: 'https://picsum.photos/seed/host1/100/100' },
    { email: 'guest@example.com', name: 'Jane Guest', avatarUrl: 'https://picsum.photos/seed/guest1/100/100' },
  ]).returning()

  // Create listings
  const [listing1, listing2, listing3] = await db.insert(listings).values([
    {
      hostId: host1.id,
      title: 'Cozy Beach House',
      description: 'A beautiful beachfront property with stunning ocean views.',
      location: 'Malibu, CA',
      imageUrl: 'https://picsum.photos/seed/listing1/800/600',
      basePrice: 150,
      weekendMultiplier: 1.2,
      defaultMinimumStay: 2,
    },
    {
      hostId: host1.id,
      title: 'Mountain Cabin Retreat',
      description: 'Secluded mountain cabin perfect for a peaceful getaway.',
      location: 'Aspen, CO',
      imageUrl: 'https://picsum.photos/seed/listing2/800/600',
      basePrice: 200,
      weekendMultiplier: 1.3,
      defaultMinimumStay: 2,
    },
    {
      hostId: host1.id,
      title: 'Downtown Loft',
      description: 'Modern loft in the heart of the city.',
      location: 'New York, NY',
      imageUrl: 'https://picsum.photos/seed/listing3/800/600',
      basePrice: 250,
      weekendMultiplier: 1.1,
      defaultMinimumStay: 1,
    },
  ]).returning()

  // Create seasonal pricing
  await db.insert(seasonalPricing).values([
    {
      listingId: listing1.id,
      name: 'Summer Peak',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      multiplier: 1.5,
    },
    {
      listingId: listing1.id,
      name: 'Holiday Season',
      startDate: '2025-12-20',
      endDate: '2026-01-02',
      multiplier: 2.0,
    },
    {
      listingId: listing2.id,
      name: 'Ski Season',
      startDate: '2025-12-01',
      endDate: '2026-03-31',
      multiplier: 1.8,
    },
    {
      listingId: listing2.id,
      name: 'Fall Foliage',
      startDate: '2025-09-15',
      endDate: '2025-10-31',
      multiplier: 1.3,
    },
    {
      listingId: listing3.id,
      name: 'New Year\'s Eve',
      startDate: '2025-12-30',
      endDate: '2026-01-01',
      multiplier: 2.5,
    },
  ])

  // Create per-date pricing overrides
  const today = new Date()
  const pricingEntries: Array<{
    listingId: number
    date: string
    price: number | null
    minimumStay: number | null
    isAvailable: boolean
  }> = []

  // Add some custom pricing for listing 1
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const dayOfWeek = date.getDay()

    // Block some dates
    if (i === 5 || i === 6) {
      pricingEntries.push({
        listingId: listing1.id,
        date: dateStr,
        price: null,
        minimumStay: null,
        isAvailable: false,
      })
    }
    // Custom prices for specific dates
    else if (i === 10 || i === 11 || i === 12) {
      pricingEntries.push({
        listingId: listing1.id,
        date: dateStr,
        price: 225,
        minimumStay: 3,
        isAvailable: true,
      })
    }
    // Weekend premium dates
    else if (dayOfWeek === 5 || dayOfWeek === 6) {
      pricingEntries.push({
        listingId: listing1.id,
        date: dateStr,
        price: 180,
        minimumStay: 2,
        isAvailable: true,
      })
    }
  }

  // Add some custom pricing for listing 2
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    if (i >= 14 && i <= 16) {
      pricingEntries.push({
        listingId: listing2.id,
        date: dateStr,
        price: 350,
        minimumStay: 3,
        isAvailable: true,
      })
    }
  }

  // Add some custom pricing for listing 3
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    if (i === 20 || i === 21) {
      pricingEntries.push({
        listingId: listing3.id,
        date: dateStr,
        price: 400,
        minimumStay: 2,
        isAvailable: true,
      })
    }
  }

  if (pricingEntries.length > 0) {
    await db.insert(listingPricing).values(pricingEntries)
  }

  console.log('Database seeded successfully!')
  console.log(`Created ${3} users, ${3} listings, ${5} seasonal pricing rules, ${pricingEntries.length} date-specific prices`)
}

seed().catch(console.error)
