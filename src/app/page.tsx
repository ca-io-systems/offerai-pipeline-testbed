import { ListingCard } from '@/components/ListingCard'
import { FilterBar } from '@/components/FilterBar'

const mockListings = [
  {
    id: '1',
    title: 'Cozy apartment with ocean view',
    location: 'Malibu, California',
    price: 250,
    rating: 4.92,
    images: [
      'https://picsum.photos/seed/listing1a/800/600',
      'https://picsum.photos/seed/listing1b/800/600',
      'https://picsum.photos/seed/listing1c/800/600',
      'https://picsum.photos/seed/listing1d/800/600',
    ],
  },
  {
    id: '2',
    title: 'Modern loft in downtown',
    location: 'New York, New York',
    price: 180,
    rating: 4.85,
    images: [
      'https://picsum.photos/seed/listing2a/800/600',
      'https://picsum.photos/seed/listing2b/800/600',
      'https://picsum.photos/seed/listing2c/800/600',
    ],
  },
  {
    id: '3',
    title: 'Charming cottage in the woods',
    location: 'Asheville, North Carolina',
    price: 120,
    rating: 4.98,
    images: [
      'https://picsum.photos/seed/listing3a/800/600',
      'https://picsum.photos/seed/listing3b/800/600',
      'https://picsum.photos/seed/listing3c/800/600',
      'https://picsum.photos/seed/listing3d/800/600',
      'https://picsum.photos/seed/listing3e/800/600',
    ],
  },
  {
    id: '4',
    title: 'Beachfront villa with pool',
    location: 'Miami Beach, Florida',
    price: 450,
    rating: 4.89,
    images: [
      'https://picsum.photos/seed/listing4a/800/600',
      'https://picsum.photos/seed/listing4b/800/600',
    ],
  },
  {
    id: '5',
    title: 'Historic brownstone apartment',
    location: 'Boston, Massachusetts',
    price: 200,
    rating: 4.76,
    images: [
      'https://picsum.photos/seed/listing5a/800/600',
      'https://picsum.photos/seed/listing5b/800/600',
      'https://picsum.photos/seed/listing5c/800/600',
    ],
  },
  {
    id: '6',
    title: 'Mountain cabin retreat',
    location: 'Lake Tahoe, California',
    price: 175,
    rating: 4.94,
    images: [
      'https://picsum.photos/seed/listing6a/800/600',
      'https://picsum.photos/seed/listing6b/800/600',
      'https://picsum.photos/seed/listing6c/800/600',
      'https://picsum.photos/seed/listing6d/800/600',
    ],
  },
]

export default function HomePage() {
  return (
    <div>
      <FilterBar />
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </div>
  )
}
