import { db } from '@/db'
import { listings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ContactHostButton } from '@/components/ContactHostButton'
import { getCurrentUserId } from '@/lib/auth'

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listingId = parseInt(id, 10)

  if (isNaN(listingId)) {
    notFound()
  }

  const [listing] = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      image: listings.image,
      price: listings.price,
      hostId: listings.hostId,
      hostName: users.name,
      hostAvatar: users.avatar,
    })
    .from(listings)
    .innerJoin(users, eq(listings.hostId, users.id))
    .where(eq(listings.id, listingId))

  if (!listing) {
    notFound()
  }

  const currentUserId = getCurrentUserId()
  const isOwnListing = listing.hostId === currentUserId

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-[#484848] mb-4">{listing.title}</h1>
          <p className="text-[#767676] mb-6">{listing.description}</p>

          <div className="border-t border-[#EBEBEB] pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#EBEBEB]">
                {listing.hostAvatar ? (
                  <Image
                    src={listing.hostAvatar}
                    alt={listing.hostName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#767676] text-lg font-semibold">
                    {listing.hostName[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-[#484848]">Hosted by {listing.hostName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#EBEBEB] p-6 sticky top-8">
            <div className="mb-4">
              <span className="text-2xl font-bold text-[#484848]">${listing.price}</span>
              <span className="text-[#767676]"> / night</span>
            </div>
            {!isOwnListing && (
              <ContactHostButton
                hostId={listing.hostId}
                listingId={listing.id}
                listingTitle={listing.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
