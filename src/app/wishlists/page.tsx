import Link from 'next/link'
import Image from 'next/image'

const wishlists = [
  {
    id: '1',
    name: 'Beach Getaways',
    count: 5,
    coverImage: 'https://picsum.photos/seed/wishlist1/400/300',
  },
  {
    id: '2',
    name: 'Mountain Retreats',
    count: 3,
    coverImage: 'https://picsum.photos/seed/wishlist2/400/300',
  },
  {
    id: '3',
    name: 'City Breaks',
    count: 8,
    coverImage: 'https://picsum.photos/seed/wishlist3/400/300',
  },
]

export default function WishlistsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#484848] mb-6">Wishlists</h1>

      {wishlists.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-[#EBEBEB] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-[#484848] mb-2">Create your first wishlist</h2>
          <p className="text-[#767676] max-w-md mx-auto">
            As you search, tap the heart icon to save your favorite places to a wishlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlists.map((wishlist) => (
            <Link
              key={wishlist.id}
              href={`/wishlists/${wishlist.id}`}
              className="block group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F7F7]">
                <Image
                  src={wishlist.coverImage}
                  alt={wishlist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-3 font-semibold text-[#484848]">{wishlist.name}</h3>
              <p className="text-sm text-[#767676]">{wishlist.count} saved</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
