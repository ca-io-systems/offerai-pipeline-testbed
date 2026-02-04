import { db } from '@/db'
import { listings } from '@/db/schema'
import { desc } from 'drizzle-orm'
import HeroSection from '@/components/HeroSection'
import HomeContent from '@/components/HomeContent'
import ExploreNearby from '@/components/ExploreNearby'
import LiveAnywhere from '@/components/LiveAnywhere'
import TryHostingBanner from '@/components/TryHostingBanner'
import InspirationTabs from '@/components/InspirationTabs'

export default async function HomePage() {
  const allListings = await db
    .select()
    .from(listings)
    .orderBy(desc(listings.rating))
    .limit(48)

  return (
    <>
      <HeroSection />
      <HomeContent listings={allListings} />
      <ExploreNearby />
      <LiveAnywhere />
      <TryHostingBanner />
      <InspirationTabs />
    </>
  )
}
