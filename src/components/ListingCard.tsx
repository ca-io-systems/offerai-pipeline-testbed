import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/db/schema'

interface ListingCardProps {
  listing: Listing
  showSuperhost?: boolean
}

export default function ListingCard({ listing, showSuperhost = false }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showSuperhost && (
          <span className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-medium text-[#484848]">
            SUPERHOST
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-[#484848] truncate flex-1">{listing.location}</h3>
          {listing.rating && (
            <span className="flex items-center gap-1 text-sm text-[#484848]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {listing.rating.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-sm text-[#767676]">{listing.title}</p>
        <p className="text-sm text-[#767676]">{listing.category}</p>
        <p className="text-[#484848]">
          <span className="font-semibold">${listing.pricePerNight}</span>
          <span className="text-[#767676]"> night</span>
        </p>
      </div>
    </Link>
  )
}
