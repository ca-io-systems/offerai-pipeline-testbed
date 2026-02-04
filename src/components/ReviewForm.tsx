'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StarRating } from './StarRating'
import { submitReview } from '@/actions/reviews'

type ReviewFormProps = {
  bookingId: number
  listingId: number
}

const CATEGORIES = [
  { name: 'cleanlinessRating', label: 'Cleanliness' },
  { name: 'accuracyRating', label: 'Accuracy' },
  { name: 'checkinRating', label: 'Check-in' },
  { name: 'communicationRating', label: 'Communication' },
  { name: 'locationRating', label: 'Location' },
  { name: 'valueRating', label: 'Value' },
] as const

export function ReviewForm({ bookingId, listingId }: ReviewFormProps) {
  const router = useRouter()
  const [overallRating, setOverallRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({
    cleanlinessRating: 0,
    accuracyRating: 0,
    checkinRating: 0,
    communicationRating: 0,
    locationRating: 0,
    valueRating: 0,
  })
  const [reviewText, setReviewText] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCategoryChange = (name: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (overallRating === 0) {
      setError('Please provide an overall rating')
      setIsSubmitting(false)
      return
    }

    const missingCategories = CATEGORIES.filter((c) => categoryRatings[c.name] === 0)
    if (missingCategories.length > 0) {
      setError(`Please rate all categories: ${missingCategories.map((c) => c.label).join(', ')}`)
      setIsSubmitting(false)
      return
    }

    if (reviewText.length < 50) {
      setError('Review must be at least 50 characters')
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('bookingId', String(bookingId))
    formData.append('listingId', String(listingId))
    formData.append('overallRating', String(overallRating))
    formData.append('reviewText', reviewText)
    Object.entries(categoryRatings).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const result = await submitReview(formData)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push(`/listings/${listingId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-[#C13515] text-[#C13515] px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Overall Rating</h2>
        <StarRating name="overallRating" value={overallRating} onChange={setOverallRating} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Category Ratings</h2>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <StarRating
              key={category.name}
              name={category.name}
              label={category.label}
              value={categoryRatings[category.name]}
              onChange={(value) => handleCategoryChange(category.name, value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Review</h2>
        <textarea
          name="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell us about your experience (minimum 50 characters)"
          className="w-full border border-[#EBEBEB] rounded-lg p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
        />
        <p className="text-sm text-[#767676] mt-1">
          {reviewText.length}/50 characters minimum
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#E74E53] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
