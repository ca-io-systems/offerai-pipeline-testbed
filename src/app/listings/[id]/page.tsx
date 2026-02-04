import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getListingById,
  getHostById,
  getListingPhotos,
  getListingAmenities,
  getListingReviews,
  calculateReviewAverages,
} from '@/lib/queries'
import Breadcrumb from '@/components/Breadcrumb'
import PhotoGallery from '@/components/PhotoGallery'
import HostInfo from '@/components/HostInfo'
import ListingStats from '@/components/ListingStats'
import Description from '@/components/Description'
import AmenitiesSection from '@/components/AmenitiesSection'
import ReviewsSection from '@/components/ReviewsSection'
import BookingCard from '@/components/BookingCard'
import HostCard from '@/components/HostCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const listing = await getListingById(Number(resolvedParams.id))

  if (!listing) {
    return {
      title: 'Listing Not Found | OfferBnb',
    }
  }

  return {
    title: `${listing.title} | OfferBnb`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: [`https://picsum.photos/seed/listing${listing.id}-1/1200/630`],
    },
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const listingId = Number(resolvedParams.id)

  if (isNaN(listingId)) {
    notFound()
  }

  const [listing, photos, amenities, reviews] = await Promise.all([
    getListingById(listingId),
    getListingPhotos(listingId),
    getListingAmenities(listingId),
    getListingReviews(listingId),
  ])

  if (!listing) {
    notFound()
  }

  const host = await getHostById(listing.hostId)

  if (!host) {
    notFound()
  }

  const categoryAverages = calculateReviewAverages(reviews)

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: listing.location, href: `/?location=${encodeURIComponent(listing.location)}` },
          { label: listing.title },
        ]}
      />

      {/* Title */}
      <h1 className="mb-4 text-2xl font-semibold">{listing.title}</h1>

      {/* Photo Gallery */}
      <PhotoGallery photos={photos} />

      {/* Two column layout */}
      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          {/* Property type and location */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {listing.propertyType} in {listing.location}
              </h2>
              <span className="rounded-md bg-[#F7F7F7] px-2 py-1 text-xs font-medium uppercase">
                {listing.propertyType.split(' ')[1] || listing.propertyType}
              </span>
            </div>
          </div>

          {/* Stats */}
          <ListingStats
            guests={listing.guests}
            bedrooms={listing.bedrooms}
            beds={listing.beds}
            baths={listing.baths}
          />

          <hr className="my-6 border-[#EBEBEB]" />

          {/* Host info */}
          <HostInfo host={host} />

          <hr className="my-6 border-[#EBEBEB]" />

          {/* Description */}
          <Description text={listing.description} />

          <hr className="my-6 border-[#EBEBEB]" />

          {/* Amenities */}
          <AmenitiesSection amenities={amenities} />

          <hr className="my-6 border-[#EBEBEB]" />

          {/* Reviews */}
          <ReviewsSection
            reviews={reviews}
            avgRating={listing.avgRating}
            reviewCount={listing.reviewCount}
            categoryAverages={categoryAverages}
          />
        </div>

        {/* Right column - Booking card */}
        <div className="lg:col-span-1">
          <BookingCard
            pricePerNight={listing.pricePerNight}
            cleaningFee={listing.cleaningFee}
            serviceFee={listing.serviceFee}
            maxGuests={listing.guests}
            avgRating={listing.avgRating}
            reviewCount={listing.reviewCount}
          />
        </div>
      </div>

      {/* Host section */}
      <hr className="my-12 border-[#EBEBEB]" />
      <HostCard host={host} />
    </div>
  )
}
