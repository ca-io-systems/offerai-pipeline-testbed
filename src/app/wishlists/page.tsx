import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getWishlists } from '@/actions/wishlists'
import { WishlistCard } from '@/components/WishlistCard'
import { CreateWishlistButton } from './CreateWishlistButton'

export default async function WishlistsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  const wishlists = await getWishlists()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#484848]">Wishlists</h1>
        <CreateWishlistButton />
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#EBEBEB] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-[#767676]">Create your first wishlist</p>
          <p className="text-[#767676] text-sm mt-1">
            As you search, click the heart icon to save your favorite places.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      )}
    </div>
  )
}
