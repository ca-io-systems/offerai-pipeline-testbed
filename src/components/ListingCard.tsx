import Image from 'next/image'
import { Star } from 'lucide-react'
import { AmenityDetail } from './AmenityDetail'
import type { Listing, Amenity } from '@/db/schema'

type ListingCardProps = {
  listing: Listing
  amenities?: Pick<Amenity, 'name' | 'icon'>[]
}

export function ListingCard({ listing, amenities = [] }: ListingCardProps) {
  return (
    <div className="group">
      <div className="aspect-square relative rounded-xl overflow-hidden mb-3">
        {listing.imageUrl && (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[#484848] truncate pr-2">{listing.title}</h3>
          {listing.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={14} fill="#484848" stroke="#484848" />
              <span className="text-sm">{listing.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-[#767676] text-sm">{listing.location}</p>
        <p className="text-[#767676] text-sm">
          {listing.guests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''} · {listing.beds} bed{listing.beds !== 1 ? 's' : ''}
        </p>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <AmenityDetail key={idx} amenity={amenity} size="sm" />
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-[#767676]">+{amenities.length - 3} more</span>
            )}
          </div>
        )}
        <p className="pt-1">
          <span className="font-semibold">${listing.pricePerNight}</span>
          <span className="text-[#767676]"> night</span>
        </p>
      </div>
    </div>
  )
}
