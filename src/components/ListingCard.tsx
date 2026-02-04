'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types'

interface ListingCardProps {
  listing: Listing
  isHighlighted: boolean
  onHover: (id: string | null) => void
}

export default function ListingCard({ listing, isHighlighted, onHover }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`listing-card block rounded-xl border border-[#EBEBEB] overflow-hidden bg-white ${
        isHighlighted ? 'highlighted' : ''
      }`}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-[#767676]">{listing.type}</span>
          <div className="flex items-center gap-1">
            <span className="text-sm">★</span>
            <span className="text-sm">{listing.rating}</span>
            <span className="text-sm text-[#767676]">({listing.reviewCount})</span>
          </div>
        </div>
        <h3 className="font-semibold mb-1 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-[#767676] mb-2">
          {listing.beds} bed{listing.beds !== 1 ? 's' : ''} · {listing.baths} bath
          {listing.baths !== 1 ? 's' : ''}
        </p>
        <p>
          <span className="font-semibold">${listing.price}</span>
          <span className="text-[#767676]"> / night</span>
        </p>
      </div>
    </Link>
  )
}
