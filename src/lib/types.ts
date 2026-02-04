import type { Location, Listing } from '@/db/schema'

export interface SearchParams {
  location?: string
  locationId?: number
  checkIn?: string
  checkOut?: string
  guests?: number
  latitude?: number
  longitude?: number
  radius?: number
}

export interface LocationSuggestion extends Location {
  listingCount: number
}

export interface ListingWithDistance extends Listing {
  distance?: number
  locationName?: string
}

export interface RecentSearch {
  location: string
  locationId?: number
  checkIn?: string
  checkOut?: string
  guests?: number
  resultCount: number
  timestamp: number
}

export type FlexibleDateOption = 'weekend' | 'week' | 'month' | null
