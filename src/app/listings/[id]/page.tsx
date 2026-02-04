import { db } from '@/db'
import { listings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getMonthPricing } from '@/lib/pricing'
import { ListingCalendar } from '@/components/ListingCalendar'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listingId = parseInt(id)

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    notFound()
  }

  const today = new Date()
  const currentMonthPricing = await getMonthPricing(
    listingId,
    today.getFullYear(),
    today.getMonth()
  )

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const nextMonthPricing = await getMonthPricing(
    listingId,
    nextMonth.getFullYear(),
    nextMonth.getMonth()
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-[4/3] relative rounded-xl overflow-hidden mb-6">
            <Image
              src={listing.imageUrl || 'https://picsum.photos/seed/default/800/600'}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-[#484848] mb-2">
            {listing.title}
          </h1>
          <p className="text-[#767676] mb-4">{listing.location}</p>
          <p className="text-[#484848] mb-6">{listing.description}</p>

          <div className="border-t border-[#EBEBEB] pt-6">
            <h2 className="text-xl font-semibold mb-2">Pricing</h2>
            <p className="text-[#484848]">
              <span className="font-semibold text-2xl">${listing.basePrice}</span>
              <span className="text-[#767676]"> / night base rate</span>
            </p>
            {listing.weekendMultiplier > 1 && (
              <p className="text-sm text-[#767676] mt-1">
                Weekend rate: {listing.weekendMultiplier}x (${Math.round(listing.basePrice * listing.weekendMultiplier)}/night)
              </p>
            )}
            {listing.defaultMinimumStay > 1 && (
              <p className="text-sm text-[#767676] mt-1">
                Minimum stay: {listing.defaultMinimumStay} nights
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-8">
            <div className="border border-[#EBEBEB] rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Availability & Prices</h2>

              <ListingCalendar
                currentMonthPricing={currentMonthPricing}
                nextMonthPricing={nextMonthPricing}
                basePrice={listing.basePrice}
                currentYear={today.getFullYear()}
                currentMonth={today.getMonth()}
              />

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-400"></div>
                  <span className="text-[#767676]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-400"></div>
                  <span className="text-[#767676]">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100 border border-blue-400"></div>
                  <span className="text-[#767676]">Custom price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                  <span className="text-[#767676]">Past</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
