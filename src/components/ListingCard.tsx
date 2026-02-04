import Image from 'next/image'
import Link from 'next/link'
import { HeartButton } from './HeartButton'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/db/schema'

type ListingCardProps = {
  listing: Listing
  isSaved: boolean
}

export function ListingCard({ listing, isSaved }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <HeartButton listingId={listing.id} initialSaved={isSaved} />
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[#484848] truncate">{listing.title}</h3>
        </div>
        <p className="text-[#767676] text-sm">{listing.location}</p>
        <p className="text-[#484848] mt-1">
          <span className="font-semibold">{formatPrice(listing.price)}</span>
          <span className="text-[#767676]"> night</span>
        </p>
      </div>
    </Link>
  )
}
