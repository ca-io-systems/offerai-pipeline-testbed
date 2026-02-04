import { db } from '@/db'
import { listings, seasonalPricing } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getMonthPricing, getSmartPricingSuggestion } from '@/lib/pricing'
import { HostPricingCalendar } from '@/components/HostPricingCalendar'
import { SeasonalPricingManager } from '@/components/SeasonalPricingManager'
import { WeekendPricingSettings } from '@/components/WeekendPricingSettings'
import { SmartPricingSuggestion } from '@/components/SmartPricingSuggestion'

interface Props {
  params: Promise<{ listingId: string }>
}

export default async function HostCalendarPage({ params }: Props) {
  const { listingId: listingIdStr } = await params
  const listingId = parseInt(listingIdStr)

  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  })

  if (!listing) {
    notFound()
  }

  const seasons = await db.query.seasonalPricing.findMany({
    where: eq(seasonalPricing.listingId, listingId),
  })

  const today = new Date()
  const pricingData: Array<{
    year: number
    month: number
    pricing: Awaited<ReturnType<typeof getMonthPricing>>
  }> = []

  // Load 3 months of pricing data
  for (let i = 0; i < 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
    const pricing = await getMonthPricing(listingId, date.getFullYear(), date.getMonth())
    pricingData.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      pricing,
    })
  }

  const smartPricing = await getSmartPricingSuggestion(listingId)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#484848] mb-1">
          Pricing Calendar
        </h1>
        <p className="text-[#767676]">{listing.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HostPricingCalendar
            listingId={listingId}
            basePrice={listing.basePrice}
            defaultMinimumStay={listing.defaultMinimumStay}
            initialPricingData={pricingData}
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

        <div className="space-y-6">
          <SmartPricingSuggestion
            currentPrice={listing.basePrice}
            averageAreaPrice={smartPricing.averageAreaPrice}
            similarListings={smartPricing.similarListings}
          />

          <WeekendPricingSettings
            listingId={listingId}
            currentMultiplier={listing.weekendMultiplier}
            basePrice={listing.basePrice}
          />

          <SeasonalPricingManager
            listingId={listingId}
            seasons={seasons}
            basePrice={listing.basePrice}
          />
        </div>
      </div>
    </div>
  )
}
