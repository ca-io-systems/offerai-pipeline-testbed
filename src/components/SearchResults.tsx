'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ListingCard } from './ListingCard'
import type { Listing } from '@/db/schema'

interface SearchResultsProps {
  initialListings: Listing[]
  totalCount: number
  hasMore: boolean
  initialOffset: number
}

export function SearchResults({
  initialListings,
  totalCount,
  hasMore: initialHasMore,
  initialOffset,
}: SearchResultsProps) {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState(initialListings)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [offset, setOffset] = useState(initialOffset)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const newOffset = offset + 20
    const params = new URLSearchParams(searchParams.toString())
    params.set('offset', newOffset.toString())

    try {
      const response = await fetch(`/api/listings?${params.toString()}`)
      const data = await response.json()

      setListings((prev) => [...prev, ...data.listings])
      setHasMore(data.hasMore)
      setOffset(newOffset)
    } catch (error) {
      console.error('Failed to load more listings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, offset, searchParams])

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 text-[#767676]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">No results found</h2>
        <p className="text-[#767676] mb-6 max-w-md mx-auto">
          Try adjusting your search by changing your dates, removing filters, or zooming out on the map.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-[#767676]">Suggestions:</p>
          <ul className="text-sm text-[#484848] space-y-2">
            <li>• Try different dates or flexible dates</li>
            <li>• Remove some filters to see more results</li>
            <li>• Search for a different location</li>
            <li>• Expand the price range</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-[#484848] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2d2d2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Show more'}
          </button>
        </div>
      )}

      {!hasMore && listings.length > 0 && (
        <p className="text-center text-[#767676] text-sm mt-10">
          Showing all {totalCount} result{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </>
  )
}
