import Image from 'next/image'
import Link from 'next/link'
import { mockListings } from '@/lib/mockData'
import { notFound } from 'next/navigation'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const listing = mockListings.find((l) => l.id === id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-[#767676] hover:text-[#484848] mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to search
      </Link>

      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-[#767676] mb-6">
            <span>{listing.type}</span>
            <span>·</span>
            <span>
              {listing.beds} bed{listing.beds !== 1 ? 's' : ''}
            </span>
            <span>·</span>
            <span>
              {listing.baths} bath{listing.baths !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <span className="text-lg">★</span>
            <span className="font-semibold">{listing.rating}</span>
            <span className="text-[#767676]">({listing.reviewCount} reviews)</span>
          </div>

          <hr className="border-[#EBEBEB] mb-8" />

          <h2 className="text-xl font-semibold mb-4">About this place</h2>
          <p className="text-[#767676] leading-relaxed">
            Experience the perfect blend of comfort and convenience in this beautiful{' '}
            {listing.type.toLowerCase()}. Located in a prime area, you&apos;ll have easy access to
            local attractions, restaurants, and public transportation. The space features modern
            amenities and thoughtful touches to make your stay memorable.
          </p>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-4 border border-[#EBEBEB] rounded-xl p-6 shadow-lg">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold">${listing.price}</span>
              <span className="text-[#767676]">/ night</span>
            </div>

            <button className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#e54e52] transition-colors mb-4">
              Reserve
            </button>

            <p className="text-center text-sm text-[#767676]">You won&apos;t be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
