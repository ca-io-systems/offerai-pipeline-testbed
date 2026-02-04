import type { Listing } from '@/db/schema'

interface ListingMiniCardProps {
  listing: Listing
}

export function ListingMiniCard({ listing }: ListingMiniCardProps) {
  return (
    <div className="border border-[#EBEBEB] rounded-xl p-4 flex gap-4">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-32 h-24 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#767676] uppercase">{listing.propertyType}</p>
        <h3 className="font-medium text-[#484848] truncate">{listing.title}</h3>
        {listing.rating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm">★</span>
            <span className="text-sm text-[#484848]">{listing.rating}</span>
            <span className="text-sm text-[#767676]">({listing.reviewCount} reviews)</span>
          </div>
        )}
      </div>
    </div>
  )
}
