import { db } from './index'
import { users, listings } from './schema'

const hostId = 'host-1'
const guestId = 'guest-1'

await db.insert(users).values([
  {
    id: hostId,
    email: 'host@example.com',
    name: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/host1/200',
  },
  {
    id: guestId,
    email: 'guest@example.com',
    name: 'John Smith',
    avatarUrl: 'https://picsum.photos/seed/guest1/200',
  },
]).onConflictDoNothing()

await db.insert(listings).values([
  {
    id: 'listing-1',
    hostId: hostId,
    title: 'Cozy Beach House with Ocean View',
    description: 'Beautiful beachfront property with stunning ocean views. Perfect for a relaxing getaway.',
    propertyType: 'Entire house',
    address: '123 Ocean Drive',
    city: 'Malibu',
    country: 'United States',
    imageUrl: 'https://picsum.photos/seed/listing1/800/600',
    pricePerNight: 250,
    cleaningFee: 75,
    serviceFee: 50,
    rating: 4.92,
    reviewCount: 128,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    houseRules: 'No smoking, No pets, No parties or events, Check-in after 3PM',
    cancellationPolicy: 'moderate',
  },
  {
    id: 'listing-2',
    hostId: hostId,
    title: 'Modern Downtown Loft',
    description: 'Stylish loft in the heart of downtown. Walking distance to restaurants and attractions.',
    propertyType: 'Entire loft',
    address: '456 Main Street',
    city: 'San Francisco',
    country: 'United States',
    imageUrl: 'https://picsum.photos/seed/listing2/800/600',
    pricePerNight: 175,
    cleaningFee: 50,
    serviceFee: 35,
    rating: 4.85,
    reviewCount: 89,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    houseRules: 'No smoking, Pets allowed, Quiet hours after 10PM',
    cancellationPolicy: 'flexible',
  },
]).onConflictDoNothing()

console.log('Database seeded successfully!')
