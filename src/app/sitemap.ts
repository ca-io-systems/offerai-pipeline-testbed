import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getListings, getCategories } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const listings = getListings()
  const categories = getCategories()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/listing/${listing.id}`,
    lastModified: new Date(listing.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...listingPages, ...categoryPages]
}
