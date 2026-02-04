import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd, generateBreadcrumbSchema } from '@/components/JsonLd'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { getCategoryBySlug, getCategories, getListings } from '@/lib/data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = getCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const title = `${category.name} Rentals`
  const url = `${SITE_URL}/category/${category.slug}`

  return {
    title,
    description: category.description,
    openGraph: {
      type: 'website',
      title: `${title} | ${SITE_NAME}`,
      description: category.description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description: category.description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const listings = getListings()
  const url = `${SITE_URL}/category/${category.slug}`

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Categories', url: `${SITE_URL}/categories` },
    { name: category.name, url },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-4 text-sm text-[#767676]">
        <a href="/" className="hover:underline">Home</a>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">{category.name} Rentals</h1>
      <p className="mb-8 text-[#767676]">{category.description}</p>

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
    </>
  )
}
