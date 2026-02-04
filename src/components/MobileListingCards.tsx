'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types'

interface MobileListingCardsProps {
  listings: Listing[]
  highlightedId: string | null
  onCardHover: (id: string | null) => void
}

export default function MobileListingCards({
  listings,
  highlightedId,
  onCardHover,
}: MobileListingCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlightedId && scrollRef.current) {
      const index = listings.findIndex((l) => l.id === highlightedId)
      if (index !== -1) {
        const cardWidth = 280
        const gap = 12
        scrollRef.current.scrollTo({
          left: index * (cardWidth + gap),
          behavior: 'smooth',
        })
      }
    }
  }, [highlightedId, listings])

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-[1000] pb-safe">
      <div className="flex justify-center py-2">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className={`flex-shrink-0 w-[280px] snap-start bg-white rounded-xl border overflow-hidden transition-all ${
              highlightedId === listing.id ? 'border-[#FF5A5F] shadow-md' : 'border-[#EBEBEB]'
            }`}
            onMouseEnter={() => onCardHover(listing.id)}
            onMouseLeave={() => onCardHover(null)}
            onTouchStart={() => onCardHover(listing.id)}
          >
            <div className="flex">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="p-3 flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs text-[#767676] mb-1">
                  <span>{listing.type}</span>
                  <span>·</span>
                  <span>★ {listing.rating}</span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">{listing.title}</h3>
                <p className="text-xs text-[#767676] mb-1">
                  {listing.beds} bed{listing.beds !== 1 ? 's' : ''} · {listing.baths} bath
                  {listing.baths !== 1 ? 's' : ''}
                </p>
                <p className="font-semibold text-sm">${listing.price}/night</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
