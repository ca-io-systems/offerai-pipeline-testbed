import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd, generateLodgingBusinessSchema, generateBreadcrumbSchema } from '@/components/JsonLd'
import { ShareButtons } from '@/components/ShareButtons'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { getListingById, getListings } from '@/lib/data'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const listings = getListings()
  return listings.map((listing) => ({ id: listing.id }))
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params
  const listing = getListingById(id)

  if (!listing) {
    return {
      title: 'Listing Not Found',
    }
  }

  const title = `${listing.title} | ${listing.city}`
  const url = `${SITE_URL}/listing/${listing.id}`

  return {
    title,
    description: listing.description,
    openGraph: {
      type: 'website',
      title,
      description: listing.description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: listing.images[0],
          width: 800,
          height: 600,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: listing.description,
      images: [listing.images[0]],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const listing = getListingById(id)

  if (!listing) {
    notFound()
  }

  const url = `${SITE_URL}/listing/${listing.id}`

  const lodgingSchema = generateLodgingBusinessSchema(listing)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Listings', url: `${SITE_URL}/search` },
    { name: listing.title, url },
  ])

  return (
    <>
      <JsonLd data={lodgingSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-4 text-sm text-[#767676]">
        <a href="/" className="hover:underline">Home</a>
        <span className="mx-2">/</span>
        <span>{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#F7F7F7]">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="mt-1 text-[#767676]">
              {listing.city}, {listing.country}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-medium">★ {listing.rating}</span>
              <span className="text-[#767676]">({listing.reviewCount} reviews)</span>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">About this place</h2>
              <p className="mt-2 text-[#767676]">{listing.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Hosted by {listing.hostName}</h2>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-[#EBEBEB] p-6">
            <div className="text-xl font-bold">
              ${listing.pricePerNight}
              <span className="text-base font-normal text-[#767676]">/night</span>
            </div>

            <button className="mt-4 w-full rounded-lg bg-[#FF5A5F] px-4 py-3 font-medium text-white hover:bg-[#E04E53] transition-colors">
              Reserve
            </button>

            <div className="mt-6 border-t border-[#EBEBEB] pt-6">
              <ShareButtons
                url={url}
                title={`${listing.title} | ${listing.city} | ${SITE_NAME}`}
                description={listing.description}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
