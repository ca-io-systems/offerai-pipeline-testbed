import { db } from '@/db'
import { bookings, listings, reviews } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { ReviewForm } from '@/components/ReviewForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params
  const bookingId = Number(id)

  if (isNaN(bookingId)) {
    notFound()
  }

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  })

  if (!booking) {
    notFound()
  }

  if (booking.status !== 'completed') {
    redirect(`/bookings/${bookingId}`)
  }

  // Check if review already exists
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.bookingId, bookingId),
  })

  if (existingReview) {
    redirect(`/listings/${booking.listingId}`)
  }

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, booking.listingId),
  })

  if (!listing) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Leave a Review</h1>
      <p className="text-[#767676] mb-8">
        Share your experience at <span className="font-medium text-[#484848]">{listing.title}</span>
      </p>
      <ReviewForm bookingId={bookingId} listingId={listing.id} />
    </div>
  )
}
