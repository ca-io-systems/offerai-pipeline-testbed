'use client'

import Link from 'next/link'
import { SwipeableGallery } from './SwipeableGallery'

interface ListingCardProps {
  id: string
  title: string
  location: string
  price: number
  rating: number
  images: string[]
  dates?: string
}

export function ListingCard({
  id,
  title,
  location,
  price,
  rating,
  images,
  dates = 'Dec 15-20',
}: ListingCardProps) {
  return (
    <Link href={`/listings/${id}`} className="block group">
      <div className="relative">
        <SwipeableGallery images={images} alt={title} />
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-3 right-3 z-10 touch-target flex items-center justify-center"
          aria-label="Add to wishlist"
        >
          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="mt-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-[#484848] truncate">{location}</h3>
            <p className="text-sm text-[#767676] truncate">{title}</p>
            <p className="text-sm text-[#767676]">{dates}</p>
            <p className="mt-1">
              <span className="font-semibold text-[#484848]">${price}</span>
              <span className="text-[#484848]"> night</span>
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <svg className="w-4 h-4 text-[#484848]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm text-[#484848]">{rating.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
