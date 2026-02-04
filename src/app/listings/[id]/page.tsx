import { db } from '@/db'
import { listings, reviews, users, hostResponses } from '@/db/schema'
import { eq, avg, count, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { StarIcon } from '@/components/StarIcon'
import { ReviewCard } from '@/components/ReviewCard'
import { CategoryRatingBar } from '@/components/CategoryRatingBar'

type Props = {
  params: Promise<{ id: string }>
}

const CATEGORY_LABELS = {
  cleanlinessRating: 'Cleanliness',
  accuracyRating: 'Accuracy',
  checkinRating: 'Check-in',
  communicationRating: 'Communication',
  locationRating: 'Location',
  valueRating: 'Value',
} as const

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const listingId = Number(id)

  if (isNaN(listingId)) {
    notFound()
  }

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    notFound()
  }

  const host = await db.query.users.findFirst({
    where: eq(users.id, listing.hostId),
  })

  // Get review stats
  const reviewStats = await db
    .select({
      avgOverall: avg(reviews.overallRating),
      avgCleanliness: avg(reviews.cleanlinessRating),
      avgAccuracy: avg(reviews.accuracyRating),
      avgCheckin: avg(reviews.checkinRating),
      avgCommunication: avg(reviews.communicationRating),
      avgLocation: avg(reviews.locationRating),
      avgValue: avg(reviews.valueRating),
      reviewCount: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.listingId, listingId))

  const stats = reviewStats[0]
  const hasReviews = stats.reviewCount > 0

  // Get reviews with guest info and host responses, sorted by most recent
  const reviewsData = await db
    .select({
      review: reviews,
      guest: users,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.guestId, users.id))
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.createdAt))

  // Get host responses for all reviews
  const reviewIds = reviewsData.map((r) => r.review.id)
  const responses = reviewIds.length > 0
    ? await db
        .select()
        .from(hostResponses)
        .where(eq(hostResponses.reviewId, reviewIds[0]))
        .then(async (first) => {
          const all = await Promise.all(
            reviewIds.map((rid) =>
              db.query.hostResponses.findFirst({
                where: eq(hostResponses.reviewId, rid),
              })
            )
          )
          return all
        })
    : []

  const reviewsWithResponses = reviewsData.map((r, i) => ({
    ...r,
    hostResponse: responses[i] || null,
  }))

  const categoryAverages = hasReviews
    ? [
        { label: CATEGORY_LABELS.cleanlinessRating, value: Number(stats.avgCleanliness) },
        { label: CATEGORY_LABELS.accuracyRating, value: Number(stats.avgAccuracy) },
        { label: CATEGORY_LABELS.checkinRating, value: Number(stats.avgCheckin) },
        { label: CATEGORY_LABELS.communicationRating, value: Number(stats.avgCommunication) },
        { label: CATEGORY_LABELS.locationRating, value: Number(stats.avgLocation) },
        { label: CATEGORY_LABELS.valueRating, value: Number(stats.avgValue) },
      ]
    : []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="text-[#767676] mb-6">{listing.location}</p>

      <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
        <Image
          src={listing.imageUrl || 'https://picsum.photos/800/600'}
          alt={listing.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border-b border-[#EBEBEB] pb-6 mb-6">
            <p className="text-lg">
              Hosted by <span className="font-semibold">{host?.name}</span>
            </p>
            <p className="text-[#767676] mt-4">{listing.description}</p>
          </div>

          {/* Reviews Section */}
          <div id="reviews">
            <div className="flex items-center gap-2 mb-6">
              {hasReviews ? (
                <>
                  <StarIcon filled className="w-6 h-6" />
                  <span className="text-2xl font-semibold">
                    {Number(stats.avgOverall).toFixed(1)}
                  </span>
                  <span className="text-2xl text-[#767676]">·</span>
                  <span className="text-2xl font-semibold">
                    {stats.reviewCount} review{stats.reviewCount !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold">No reviews yet</span>
              )}
            </div>

            {hasReviews && (
              <>
                {/* Category Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {categoryAverages.map((cat) => (
                    <CategoryRatingBar
                      key={cat.label}
                      label={cat.label}
                      value={cat.value}
                    />
                  ))}
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviewsWithResponses.map(({ review, guest, hostResponse }) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      guest={guest}
                      hostResponse={hostResponse}
                      hostName={host?.name || 'Host'}
                      hostId={listing.hostId}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 border border-[#EBEBEB] rounded-xl p-6 shadow-lg">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-semibold">${listing.pricePerNight}</span>
              <span className="text-[#767676]">night</span>
            </div>
            {hasReviews && (
              <div className="flex items-center gap-1 text-sm mb-4">
                <StarIcon filled className="w-4 h-4" />
                <span className="font-medium">{Number(stats.avgOverall).toFixed(1)}</span>
                <span className="text-[#767676]">· {stats.reviewCount} reviews</span>
              </div>
            )}
            <button className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#E74E53]">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
