export interface Listing {
  id: string
  title: string
  price: number
  lat: number
  lng: number
  rating: number
  reviewCount: number
  imageUrl: string
  type: string
  beds: number
  baths: number
}

export interface SearchFilters {
  minPrice?: number
  maxPrice?: number
  beds?: number
  type?: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}
