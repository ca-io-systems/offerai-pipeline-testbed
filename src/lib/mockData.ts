import type { Listing } from './types'

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Cozy Downtown Apartment',
    price: 125,
    lat: 40.7128,
    lng: -74.006,
    rating: 4.9,
    reviewCount: 128,
    imageUrl: 'https://picsum.photos/seed/listing1/400/300',
    type: 'Apartment',
    beds: 2,
    baths: 1,
  },
  {
    id: '2',
    title: 'Luxury Loft with City Views',
    price: 250,
    lat: 40.7282,
    lng: -73.9942,
    rating: 4.8,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/seed/listing2/400/300',
    type: 'Loft',
    beds: 1,
    baths: 1,
  },
  {
    id: '3',
    title: 'Charming Brooklyn Brownstone',
    price: 175,
    lat: 40.6892,
    lng: -73.9442,
    rating: 4.7,
    reviewCount: 203,
    imageUrl: 'https://picsum.photos/seed/listing3/400/300',
    type: 'House',
    beds: 3,
    baths: 2,
  },
  {
    id: '4',
    title: 'Modern Studio in SoHo',
    price: 150,
    lat: 40.7233,
    lng: -74.0001,
    rating: 4.6,
    reviewCount: 156,
    imageUrl: 'https://picsum.photos/seed/listing4/400/300',
    type: 'Studio',
    beds: 1,
    baths: 1,
  },
  {
    id: '5',
    title: 'Spacious Upper East Side Condo',
    price: 300,
    lat: 40.7736,
    lng: -73.9566,
    rating: 4.9,
    reviewCount: 67,
    imageUrl: 'https://picsum.photos/seed/listing5/400/300',
    type: 'Condo',
    beds: 3,
    baths: 2,
  },
  {
    id: '6',
    title: 'Hip Williamsburg Loft',
    price: 185,
    lat: 40.7081,
    lng: -73.9571,
    rating: 4.5,
    reviewCount: 234,
    imageUrl: 'https://picsum.photos/seed/listing6/400/300',
    type: 'Loft',
    beds: 2,
    baths: 1,
  },
  {
    id: '7',
    title: 'Quiet Chelsea Garden Apartment',
    price: 200,
    lat: 40.7465,
    lng: -74.0014,
    rating: 4.8,
    reviewCount: 112,
    imageUrl: 'https://picsum.photos/seed/listing7/400/300',
    type: 'Apartment',
    beds: 2,
    baths: 1,
  },
  {
    id: '8',
    title: 'Financial District Penthouse',
    price: 450,
    lat: 40.7074,
    lng: -74.0113,
    rating: 5.0,
    reviewCount: 45,
    imageUrl: 'https://picsum.photos/seed/listing8/400/300',
    type: 'Penthouse',
    beds: 4,
    baths: 3,
  },
  {
    id: '9',
    title: 'Artsy East Village Studio',
    price: 95,
    lat: 40.7264,
    lng: -73.9818,
    rating: 4.4,
    reviewCount: 189,
    imageUrl: 'https://picsum.photos/seed/listing9/400/300',
    type: 'Studio',
    beds: 1,
    baths: 1,
  },
  {
    id: '10',
    title: 'Tribeca Family Home',
    price: 375,
    lat: 40.7163,
    lng: -74.0086,
    rating: 4.9,
    reviewCount: 78,
    imageUrl: 'https://picsum.photos/seed/listing10/400/300',
    type: 'House',
    beds: 4,
    baths: 2,
  },
  {
    id: '11',
    title: 'Midtown Convenience Suite',
    price: 165,
    lat: 40.7549,
    lng: -73.984,
    rating: 4.3,
    reviewCount: 267,
    imageUrl: 'https://picsum.photos/seed/listing11/400/300',
    type: 'Apartment',
    beds: 1,
    baths: 1,
  },
  {
    id: '12',
    title: 'Greenwich Village Charm',
    price: 225,
    lat: 40.7336,
    lng: -74.0027,
    rating: 4.7,
    reviewCount: 145,
    imageUrl: 'https://picsum.photos/seed/listing12/400/300',
    type: 'Apartment',
    beds: 2,
    baths: 1,
  },
]

export function filterListings(
  listings: Listing[],
  filters: { minPrice?: number; maxPrice?: number; beds?: number; type?: string }
): Listing[] {
  return listings.filter((listing) => {
    if (filters.minPrice !== undefined && listing.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice !== undefined && listing.price > filters.maxPrice) {
      return false
    }
    if (filters.beds !== undefined && listing.beds < filters.beds) {
      return false
    }
    if (filters.type && listing.type !== filters.type) {
      return false
    }
    return true
  })
}

export function filterListingsByBounds(
  listings: Listing[],
  bounds: { north: number; south: number; east: number; west: number }
): Listing[] {
  return listings.filter((listing) => {
    return (
      listing.lat <= bounds.north &&
      listing.lat >= bounds.south &&
      listing.lng <= bounds.east &&
      listing.lng >= bounds.west
    )
  })
}
