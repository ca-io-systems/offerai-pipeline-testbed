import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getWishlistById } from '@/actions/wishlists'
import { WishlistDetailClient } from './WishlistDetailClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function WishlistDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  const wishlist = await getWishlistById(id)

  if (!wishlist) {
    notFound()
  }

  // If not owner and not public, redirect
  if (!wishlist.isOwner && !wishlist.isPublic) {
    redirect('/wishlists')
  }

  return <WishlistDetailClient wishlist={wishlist} isOwner={wishlist.isOwner} />
}
