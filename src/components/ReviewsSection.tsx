import Image from 'next/image'
import type { Review } from '@/db/schema'

interface ReviewsSectionProps {
  reviews: Review[]
  avgRating: number
  reviewCount: number
  categoryAverages: {
    cleanliness: number
    accuracy: number
    checkIn: number
    communication: number
    location: number
    value: number
  }
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const percentage = (value / 5) * 100

  return (
    <div className="flex items-center gap-4">
      <span className="w-28 text-sm">{label}</span>
      <div className="h-1 flex-1 rounded-full bg-[#EBEBEB]">
        <div
          className="h-full rounded-full bg-[#484848]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm">{value.toFixed(1)}</span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-[#EBEBEB] pb-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={review.authorAvatarUrl}
            alt={review.authorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{review.authorName}</p>
          <p className="text-sm text-[#767676]">{review.date}</p>
        </div>
      </div>
      <p className="text-[#484848]">{review.text}</p>
    </div>
  )
}

export default function ReviewsSection({
  reviews,
  avgRating,
  reviewCount,
  categoryAverages,
}: ReviewsSectionProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl">★</span>
        <span className="text-xl font-semibold">{avgRating.toFixed(2)}</span>
        <span className="text-xl">·</span>
        <span className="text-xl font-semibold">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Category breakdown */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <RatingBar label="Cleanliness" value={categoryAverages.cleanliness} />
        <RatingBar label="Accuracy" value={categoryAverages.accuracy} />
        <RatingBar label="Check-in" value={categoryAverages.checkIn} />
        <RatingBar label="Communication" value={categoryAverages.communication} />
        <RatingBar label="Location" value={categoryAverages.location} />
        <RatingBar label="Value" value={categoryAverages.value} />
      </div>

      {/* Individual reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
