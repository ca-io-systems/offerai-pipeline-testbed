import type { Metadata } from 'next'
import { JsonLd, generateWebSiteSchema, generateBreadcrumbSchema } from '@/components/JsonLd'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants'
import { getListings, getCategories } from '@/lib/data'

export const metadata: Metadata = {
  title: `${SITE_NAME} — Find Unique Places to Stay`,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: `${SITE_NAME} — Find Unique Places to Stay`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Find Unique Places to Stay`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function HomePage() {
  const listings = getListings()
  const categories = getCategories()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
  ])

  const webSiteSchema = generateWebSiteSchema()

  return (
    <>
      <JsonLd data={webSiteSchema} />
      <JsonLd data={breadcrumbSchema} />

      <h1 className="mb-8 text-3xl font-bold">Find your next stay</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="block rounded-lg border border-[#EBEBEB] p-4 hover:border-[#FF5A5F] transition-colors"
            >
              <h3 className="font-medium">{category.name}</h3>
              <p className="mt-1 text-sm text-[#767676]">{category.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured Listings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <a
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#F7F7F7]">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{listing.title}</h3>
                  <span className="text-sm">★ {listing.rating}</span>
                </div>
                <p className="text-sm text-[#767676]">{listing.city}</p>
                <p className="mt-1 font-medium">${listing.pricePerNight}/night</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
