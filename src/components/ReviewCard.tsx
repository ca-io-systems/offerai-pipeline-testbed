'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from './StarIcon'
import { HostResponseForm } from './HostResponseForm'
import type { Review, HostResponse, User } from '@/db/schema'

type ReviewCardProps = {
  review: Review
  guest: User | null
  hostResponse: HostResponse | null
  hostName: string
  hostId: number
}

export function ReviewCard({ review, guest, hostResponse, hostName, hostId }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [currentResponse, setCurrentResponse] = useState(hostResponse)
  const isLongReview = review.reviewText.length > 200
  const displayText = expanded || !isLongReview ? review.reviewText : `${review.reviewText.slice(0, 200)}...`

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
  }

  const handleResponseSubmitted = (responseText: string) => {
    setCurrentResponse({
      id: 0,
      reviewId: review.id,
      hostId,
      responseText,
      createdAt: new Date(),
    })
    setShowResponseForm(false)
  }

  return (
    <div className="border-b border-[#EBEBEB] pb-6 last:border-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EBEBEB]">
          {guest?.avatarUrl ? (
            <Image
              src={guest.avatarUrl}
              alt={guest.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#767676] font-medium">
              {guest?.name?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{guest?.name || 'Anonymous'}</p>
          <p className="text-sm text-[#767676]">{formatDate(review.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={star <= review.overallRating}
            className="w-4 h-4"
          />
        ))}
      </div>

      <p className="text-[#484848]">{displayText}</p>
      {isLongReview && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-semibold underline mt-2 text-[#484848]"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {currentResponse && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-[#EBEBEB]">
          <p className="text-sm font-medium text-[#767676] mb-1">
            Response from {hostName}
          </p>
          <p className="text-[#484848] text-sm">{currentResponse.responseText}</p>
        </div>
      )}

      {!currentResponse && !showResponseForm && (
        <button
          onClick={() => setShowResponseForm(true)}
          className="mt-4 text-sm font-medium text-[#FF5A5F] hover:underline"
        >
          Respond
        </button>
      )}

      {showResponseForm && (
        <HostResponseForm
          reviewId={review.id}
          hostId={hostId}
          onCancel={() => setShowResponseForm(false)}
          onSubmitted={handleResponseSubmitted}
        />
      )}
    </div>
  )
}
