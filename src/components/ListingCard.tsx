'use client'

import Image from 'next/image'
import type { ListingWithDistance } from '@/lib/types'
import { formatDistance } from '@/lib/distance'

interface ListingCardProps {
  listing: ListingWithDistance
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#EBEBEB] flex items-center justify-center">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        {listing.distance !== undefined && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-[#484848]">
            {formatDistance(listing.distance)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-[#767676] mb-1">{listing.locationName}</div>
        <h3 className="font-medium text-[#484848] mb-2 line-clamp-2">{listing.title}</h3>
        <p className="text-sm text-[#767676] mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#484848]">${listing.pricePerNight}</span>
            <span className="text-[#767676]"> / night</span>
          </div>
          <div className="text-sm text-[#767676]">
            Up to {listing.maxGuests} {listing.maxGuests === 1 ? 'guest' : 'guests'}
          </div>
        </div>
      </div>
    </div>
  )
}
