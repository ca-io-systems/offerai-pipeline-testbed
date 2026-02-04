import Image from 'next/image'
import Link from 'next/link'
import type { WishlistWithItems } from '@/actions/wishlists'

type WishlistCardProps = {
  wishlist: WishlistWithItems
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  const images = wishlist.items.map((item) => item.imageUrl)
  
  return (
    <Link href={`/wishlists/${wishlist.id}`} className="block group">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#F7F7F7]">
        {images.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[#767676]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        ) : images.length === 1 ? (
          <Image
            src={images[0]}
            alt={wishlist.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : images.length === 2 ? (
          <div className="grid grid-cols-2 h-full gap-0.5">
            <div className="relative">
              <Image src={images[0]} alt="" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative">
              <Image src={images[1]} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 h-full gap-0.5">
            <div className="relative row-span-2">
              <Image src={images[0]} alt="" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative">
              <Image src={images[1]} alt="" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative">
              <Image src={images[2]} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-[#484848]">{wishlist.name}</h3>
        <p className="text-[#767676] text-sm">{wishlist.itemCount} saved</p>
      </div>
    </Link>
  )
}
