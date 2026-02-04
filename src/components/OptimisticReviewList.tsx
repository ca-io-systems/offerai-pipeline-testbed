'use client'

import { useOptimisticList } from '@/hooks/useOptimisticList'
import { ReactNode } from 'react'

type Review = {
  id: string
  content: string
  rating: number
  authorName: string
  authorAvatar?: string
  createdAt: string
}

type OptimisticReviewListProps = {
  initialReviews: Review[]
  onSubmitReview: (review: Review) => Promise<void>
  renderReview: (review: Review) => ReactNode
  className?: string
}

export function OptimisticReviewList({
  initialReviews,
  onSubmitReview,
  renderReview,
  className = '',
}: OptimisticReviewListProps) {
  const { items: reviews, isPending, error, addItem } = useOptimisticList({
    initialItems: initialReviews,
    onAdd: onSubmitReview,
    getId: (review) => review.id,
  })

  const handleSubmit = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    addItem(newReview)
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 rounded-lg bg-error/10 p-3 text-error">
          Failed to submit review. Please try again.
        </div>
      )}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={review.id.startsWith('temp-') ? 'opacity-70' : ''}
          >
            {renderReview(review)}
          </div>
        ))}
      </div>
    </div>
  )
}

export type { Review }
