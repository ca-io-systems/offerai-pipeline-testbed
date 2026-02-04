import type { Listing } from '@/lib/types'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateLodgingBusinessSchema(listing: Listing) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: listing.title,
    description: listing.description,
    image: listing.images[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressCountry: listing.country,
    },
    priceRange: `$${listing.pricePerNight}/night`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: listing.rating,
      reviewCount: listing.reviewCount,
    },
  }
}
