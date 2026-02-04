import { db } from './index'
import { locations, listings } from './schema'

const locationData = [
  { city: 'Paris', region: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522, imageUrl: 'https://picsum.photos/seed/paris/400/300', isPopular: true },
  { city: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, imageUrl: 'https://picsum.photos/seed/london/400/300', isPopular: true },
  { city: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, imageUrl: 'https://picsum.photos/seed/newyork/400/300', isPopular: true },
  { city: 'Tokyo', region: 'Kantō', country: 'Japan', latitude: 35.6762, longitude: 139.6503, imageUrl: 'https://picsum.photos/seed/tokyo/400/300', isPopular: true },
  { city: 'Barcelona', region: 'Catalonia', country: 'Spain', latitude: 41.3851, longitude: 2.1734, imageUrl: 'https://picsum.photos/seed/barcelona/400/300', isPopular: true },
  { city: 'Los Angeles', region: 'California', country: 'United States', latitude: 34.0522, longitude: -118.2437, imageUrl: 'https://picsum.photos/seed/losangeles/400/300', isPopular: true },
  { city: 'Rome', region: 'Lazio', country: 'Italy', latitude: 41.9028, longitude: 12.4964, imageUrl: 'https://picsum.photos/seed/rome/400/300', isPopular: false },
  { city: 'Berlin', region: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, imageUrl: 'https://picsum.photos/seed/berlin/400/300', isPopular: false },
  { city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041, imageUrl: 'https://picsum.photos/seed/amsterdam/400/300', isPopular: false },
  { city: 'Sydney', region: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093, imageUrl: 'https://picsum.photos/seed/sydney/400/300', isPopular: false },
  { city: 'San Francisco', region: 'California', country: 'United States', latitude: 37.7749, longitude: -122.4194, imageUrl: 'https://picsum.photos/seed/sanfrancisco/400/300', isPopular: false },
  { city: 'Miami', region: 'Florida', country: 'United States', latitude: 25.7617, longitude: -80.1918, imageUrl: 'https://picsum.photos/seed/miami/400/300', isPopular: false },
]

const listingTitles = [
  'Cozy Studio in the Heart of the City',
  'Charming Apartment with Amazing Views',
  'Luxury Penthouse with Rooftop Terrace',
  'Modern Loft Near Downtown',
  'Sunny Flat with Balcony',
  'Historic Building Renovated Apartment',
  'Beach House Retreat',
  'Mountain View Cabin',
  'Urban Oasis with Garden',
  'Stylish Suite for Business Travelers',
]

const descriptions = [
  'Perfect for couples or solo travelers looking for a comfortable stay.',
  'Enjoy breathtaking views from this beautifully decorated space.',
  'Experience luxury living with all modern amenities included.',
  'Ideal location for exploring the city and its attractions.',
  'Relax in this bright and airy space after a day of adventures.',
]

async function seed() {
  console.log('Seeding database...')

  // Clear existing data
  await db.delete(listings)
  await db.delete(locations)

  // Insert locations
  const insertedLocations = await db.insert(locations).values(locationData).returning()

  // Insert listings for each location
  for (const location of insertedLocations) {
    const numListings = Math.floor(Math.random() * 5) + 3 // 3-7 listings per location
    for (let i = 0; i < numListings; i++) {
      const title = listingTitles[Math.floor(Math.random() * listingTitles.length)]
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]
      // Add slight variation to coordinates (within ~1km)
      const latOffset = (Math.random() - 0.5) * 0.02
      const lngOffset = (Math.random() - 0.5) * 0.02

      await db.insert(listings).values({
        title: `${title} in ${location.city}`,
        description,
        locationId: location.id,
        pricePerNight: Math.floor(Math.random() * 300) + 50,
        maxGuests: Math.floor(Math.random() * 6) + 1,
        latitude: location.latitude + latOffset,
        longitude: location.longitude + lngOffset,
        imageUrl: `https://picsum.photos/seed/${location.city.toLowerCase()}${i}/400/300`,
      })
    }
  }

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
