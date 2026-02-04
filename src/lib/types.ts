export interface Listing {
  id: string
  title: string
  description: string
  city: string
  country: string
  address: string
  pricePerNight: number
  images: string[]
  rating: number
  reviewCount: number
  hostName: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}
