import { Suspense } from 'react'
import { SearchBoxWrapper } from '@/components/SearchBoxWrapper'
import { SearchResults } from '@/components/SearchResults'
import { getPopularDestinations } from '@/actions/search'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const popularDestinations = await getPopularDestinations()

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#484848] mb-6">Find your next stay</h2>

      <SearchBoxWrapper popularDestinations={popularDestinations} />

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults searchParams={params} />
      </Suspense>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div className="h-48 bg-[#EBEBEB]" />
          <div className="p-4">
            <div className="h-4 bg-[#EBEBEB] rounded mb-2 w-1/2" />
            <div className="h-5 bg-[#EBEBEB] rounded mb-2" />
            <div className="h-4 bg-[#EBEBEB] rounded mb-3 w-3/4" />
            <div className="h-5 bg-[#EBEBEB] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
