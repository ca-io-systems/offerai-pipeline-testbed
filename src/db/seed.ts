import { db } from './index'
import { hosts, listings } from './schema'

const LOCATIONS = [
  'New York, NY',
  'Los Angeles, CA',
  'Miami, FL',
  'San Francisco, CA',
  'Seattle, WA',
  'Austin, TX',
  'Chicago, IL',
  'Denver, CO',
  'Nashville, TN',
  'Portland, OR',
]

const PROPERTY_TYPES = ['house', 'apartment', 'guesthouse', 'hotel']
const ROOM_TYPES = ['entire', 'private', 'shared']
const AMENITIES = [
  'wifi',
  'kitchen',
  'washer',
  'dryer',
  'air_conditioning',
  'heating',
  'pool',
  'hot_tub',
  'free_parking',
  'ev_charger',
  'gym',
  'breakfast',
  'indoor_fireplace',
  'smoking_allowed',
  'pets_allowed',
  'dedicated_workspace',
]

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min
  return parseFloat(value.toFixed(decimals))
}

async function seed() {
  // Clear existing data
  await db.delete(listings)
  await db.delete(hosts)

  // Seed hosts
  const hostNames = [
    'Sarah',
    'Michael',
    'Emma',
    'James',
    'Olivia',
    'William',
    'Sophia',
    'Benjamin',
    'Isabella',
    'Lucas',
  ]

  const createdHosts = await Promise.all(
    hostNames.map((name, i) =>
      db
        .insert(hosts)
        .values({
          name,
          avatar: `https://picsum.photos/seed/host${i}/100/100`,
          superhost: Math.random() > 0.7,
        })
        .returning()
    )
  )

  const hostIds = createdHosts.map((h) => h[0].id)

  // Seed listings
  const listingTitles = [
    'Cozy downtown retreat',
    'Sunny beach house',
    'Modern urban loft',
    'Charming cottage',
    'Luxury penthouse',
    'Rustic cabin',
    'Stylish studio',
    'Spacious family home',
    'Boutique apartment',
    'Treehouse getaway',
  ]

  for (let i = 0; i < 50; i++) {
    const propertyType = PROPERTY_TYPES[randomInt(0, PROPERTY_TYPES.length - 1)]
    const roomType = ROOM_TYPES[randomInt(0, ROOM_TYPES.length - 1)]
    const bedrooms = roomType === 'entire' ? randomInt(1, 5) : randomInt(1, 2)
    const maxGuests = bedrooms * 2 + randomInt(0, 2)
    const hasRating = Math.random() > 0.1

    const images = Array.from(
      { length: randomInt(3, 6) },
      (_, j) => `https://picsum.photos/seed/listing${i}-${j}/800/600`
    )

    await db.insert(listings).values({
      title: `${listingTitles[i % listingTitles.length]} #${i + 1}`,
      description: `A wonderful ${propertyType} in a great location.`,
      location: LOCATIONS[randomInt(0, LOCATIONS.length - 1)],
      pricePerNight: randomInt(50, 500),
      propertyType,
      roomType,
      maxGuests,
      bedrooms,
      beds: bedrooms + randomInt(0, 2),
      bathrooms: randomFloat(1, Math.max(1, bedrooms), 1),
      amenities: JSON.stringify(randomSubset(AMENITIES, 4, 10)),
      images: JSON.stringify(images),
      rating: hasRating ? randomFloat(3.5, 5, 2) : null,
      reviewCount: hasRating ? randomInt(5, 300) : 0,
      hostId: hostIds[randomInt(0, hostIds.length - 1)],
      instantBook: Math.random() > 0.5,
      createdAt: new Date(Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000)),
    })
  }

  console.log('Database seeded with 10 hosts and 50 listings!')
}

seed().catch(console.error)
