import Image from 'next/image'
import { StarIcon } from './StarIcon'

type ListingWithRating = {
  id: number
  title: string
  location: string
  pricePerNight: number
  imageUrl: string | null
  avgRating: number | null
  reviewCount: number
}

export function ListingCard({ listing }: { listing: ListingWithRating }) {
  return (
    <a href={`/listings/${listing.id}`} className="block group">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <Image
          src={listing.imageUrl || 'https://picsum.photos/800/600'}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#484848]">{listing.location}</h3>
          <p className="text-[#767676] text-sm">{listing.title}</p>
          <p className="mt-1">
            <span className="font-semibold">${listing.pricePerNight}</span>
            <span className="text-[#767676]"> night</span>
          </p>
        </div>
        {listing.reviewCount > 0 && listing.avgRating !== null && (
          <div className="flex items-center gap-1">
            <StarIcon filled className="w-4 h-4" />
            <span className="text-sm font-medium">{listing.avgRating.toFixed(1)}</span>
            <span className="text-sm text-[#767676]">({listing.reviewCount})</span>
          </div>
        )}
      </div>
    </a>
  )
}
