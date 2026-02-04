import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getListingById } from '@/actions/listings'
import { isListingSaved } from '@/actions/wishlists'
import { HeartButton } from '@/components/HeartButton'
import { formatPrice } from '@/lib/utils'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  const isSaved = await isListingSaved(listing.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          priority
        />
        <HeartButton listingId={listing.id} initialSaved={isSaved} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold text-[#484848] mb-2">{listing.title}</h1>
          <p className="text-[#767676] mb-4">{listing.location}</p>
          <p className="text-[#484848]">{listing.description}</p>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-[#EBEBEB] rounded-xl p-6 sticky top-8">
            <p className="text-xl mb-4">
              <span className="font-semibold text-[#484848]">{formatPrice(listing.price)}</span>
              <span className="text-[#767676]"> night</span>
            </p>
            <button className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-medium hover:bg-[#FF5A5F]/90">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
