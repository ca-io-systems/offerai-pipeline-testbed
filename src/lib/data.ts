import type { Listing, Category } from './types'

// Mock data for listings
export const listings: Listing[] = [
  {
    id: '1',
    title: 'Cozy Downtown Apartment',
    description: 'A beautiful apartment in the heart of the city with stunning views and modern amenities. Perfect for couples or solo travelers looking for a comfortable stay.',
    city: 'New York',
    country: 'United States',
    address: '123 Main St, New York, NY 10001',
    pricePerNight: 150,
    images: ['https://picsum.photos/seed/listing1/800/600'],
    rating: 4.8,
    reviewCount: 124,
    hostName: 'John Doe',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Beachfront Villa',
    description: 'Stunning beachfront villa with private pool and direct beach access. Wake up to the sound of waves and enjoy breathtaking sunsets.',
    city: 'Miami',
    country: 'United States',
    address: '456 Ocean Drive, Miami, FL 33139',
    pricePerNight: 350,
    images: ['https://picsum.photos/seed/listing2/800/600'],
    rating: 4.9,
    reviewCount: 89,
    hostName: 'Jane Smith',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    description: 'Escape to this rustic mountain cabin surrounded by nature. Perfect for hiking enthusiasts and those seeking tranquility.',
    city: 'Denver',
    country: 'United States',
    address: '789 Mountain Rd, Denver, CO 80201',
    pricePerNight: 200,
    images: ['https://picsum.photos/seed/listing3/800/600'],
    rating: 4.7,
    reviewCount: 56,
    hostName: 'Bob Johnson',
    updatedAt: '2024-01-18',
  },
]

export const categories: Category[] = [
  {
    id: '1',
    name: 'Beachfront',
    slug: 'beachfront',
    description: 'Properties with direct beach access and ocean views.',
  },
  {
    id: '2',
    name: 'Mountain',
    slug: 'mountain',
    description: 'Cabins and lodges in scenic mountain locations.',
  },
  {
    id: '3',
    name: 'City',
    slug: 'city',
    description: 'Urban apartments and condos in vibrant city centers.',
  },
]

export function getListingById(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id)
}

export function getListings(): Listing[] {
  return listings
}

export function getCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
