import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getWishlistByShareToken } from '@/actions/wishlists'
import { formatPrice } from '@/lib/utils'

type PageProps = {
  params: Promise<{ token: string }>
}

export default async function SharedWishlistPage({ params }: PageProps) {
  const { token } = await params
  const wishlist = await getWishlistByShareToken(token)

  if (!wishlist) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-[#484848] mb-2">{wishlist.name}</h1>
      <p className="text-[#767676] mb-6">{wishlist.items.length} saved</p>

      {wishlist.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#767676]">No listings in this wishlist</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`} className="block group">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div>
                <h3 className="font-medium text-[#484848] truncate">{listing.title}</h3>
                <p className="text-[#767676] text-sm">{listing.location}</p>
                <p className="text-[#484848] mt-1">
                  <span className="font-semibold">{formatPrice(listing.price)}</span>
                  <span className="text-[#767676]"> night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
