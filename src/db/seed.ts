import { db } from './index'
import { listings, type NewListing } from './schema'

const categories = [
  'Icons', 'Beachfront', 'Cabins', 'OMG!', 'Trending',
  'Surfing', 'Amazing pools', 'Countryside', 'Lakefront',
  'Design', 'Castles', 'Arctic'
]

const cities = [
  { city: 'Los Angeles', country: 'United States' },
  { city: 'Miami', country: 'United States' },
  { city: 'New York', country: 'United States' },
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'Cancun', country: 'Mexico' },
]

const adjectives = ['Stunning', 'Cozy', 'Luxurious', 'Modern', 'Charming', 'Spacious', 'Beautiful', 'Amazing']
const propertyTypes = ['Villa', 'Apartment', 'Cabin', 'House', 'Cottage', 'Loft', 'Suite', 'Bungalow']

const hostNames = [
  'Sarah', 'Michael', 'Emma', 'David', 'Sophie', 'James',
  'Olivia', 'William', 'Isabella', 'Alexander', 'Mia', 'Daniel'
]

const seedListings: NewListing[] = []

for (let i = 0; i < 48; i++) {
  const cityData = cities[i % cities.length]
  const category = categories[i % categories.length]
  const adj = adjectives[i % adjectives.length]
  const propType = propertyTypes[i % propertyTypes.length]
  const hostName = hostNames[i % hostNames.length]

  seedListings.push({
    title: `${adj} ${propType} in ${cityData.city}`,
    description: `Experience this ${adj.toLowerCase()} ${propType.toLowerCase()} located in the heart of ${cityData.city}.`,
    location: `${cityData.city}, ${cityData.country}`,
    city: cityData.city,
    country: cityData.country,
    pricePerNight: 80 + Math.floor(Math.random() * 420),
    rating: 4.0 + Math.random() * 1.0,
    reviewCount: 10 + Math.floor(Math.random() * 290),
    imageUrl: `https://picsum.photos/seed/${i + 100}/400/300`,
    category,
    hostName,
    isSuperhost: Math.random() > 0.6,
  })
}

async function seed() {
  await db.delete(listings)
  await db.insert(listings).values(seedListings)
  console.log(`Seeded ${seedListings.length} listings`)
}

seed()
