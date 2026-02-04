interface ListingStatsProps {
  guests: number
  bedrooms: number
  beds: number
  baths: number
}

export default function ListingStats({ guests, bedrooms, beds, baths }: ListingStatsProps) {
  return (
    <div className="flex items-center gap-1 text-[#767676]">
      <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
      <span>·</span>
      <span>{bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}</span>
      <span>·</span>
      <span>{beds} bed{beds !== 1 ? 's' : ''}</span>
      <span>·</span>
      <span>{baths} bath{baths !== 1 ? 's' : ''}</span>
    </div>
  )
}
