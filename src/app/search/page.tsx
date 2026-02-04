'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import ListingCard from '@/components/ListingCard'
import SearchFiltersComponent from '@/components/SearchFilters'
import ViewToggle from '@/components/ViewToggle'
import MobileListingCards from '@/components/MobileListingCards'
import { mockListings, filterListings, filterListingsByBounds } from '@/lib/mockData'
import type { SearchFilters, MapBounds } from '@/lib/types'

const ListingsMap = dynamic(() => import('@/components/ListingsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F7F7F7]">
      <div className="text-[#767676]">Loading map...</div>
    </div>
  ),
})

type ViewMode = 'grid' | 'map'

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)
  const [searchedBounds, setSearchedBounds] = useState<MapBounds | null>(null)
  const [showMobileList, setShowMobileList] = useState(false)

  const filteredListings = useMemo(() => {
    let result = filterListings(mockListings, filters)
    if (searchedBounds) {
      result = filterListingsByBounds(result, searchedBounds)
    }
    return result
  }, [filters, searchedBounds])

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      setMapBounds(bounds)
      if (searchedBounds) {
        const boundsChanged =
          Math.abs(bounds.north - searchedBounds.north) > 0.01 ||
          Math.abs(bounds.south - searchedBounds.south) > 0.01 ||
          Math.abs(bounds.east - searchedBounds.east) > 0.01 ||
          Math.abs(bounds.west - searchedBounds.west) > 0.01
        setShowSearchButton(boundsChanged)
      }
    },
    [searchedBounds]
  )

  const handleSearchArea = useCallback(() => {
    if (mapBounds) {
      setSearchedBounds(mapBounds)
      setShowSearchButton(false)
    }
  }, [mapBounds])

  const handleMarkerHover = useCallback((id: string | null) => {
    setHighlightedId(id)
  }, [])

  const handleCardHover = useCallback((id: string | null) => {
    setHighlightedId(id)
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <SearchFiltersComponent filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB]">
        <p className="text-sm text-[#767676]">
          <span className="font-semibold text-[#484848]">{filteredListings.length}</span>{' '}
          {filteredListings.length === 1 ? 'stay' : 'stays'}
          {searchedBounds ? ' in map area' : ''}
        </p>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === 'grid' ? (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isHighlighted={highlightedId === listing.id}
                onHover={handleCardHover}
              />
            ))}
          </div>
          {filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold mb-2">No listings found</p>
              <p className="text-[#767676]">Try adjusting your filters or search area</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-[400px] lg:w-[480px] flex-shrink-0 overflow-auto border-r border-[#EBEBEB]">
              <div className="p-4 space-y-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isHighlighted={highlightedId === listing.id}
                    onHover={handleCardHover}
                  />
                ))}
                {filteredListings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-lg font-semibold mb-2">No listings found</p>
                    <p className="text-[#767676]">Try adjusting your filters or search area</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              <ListingsMap
                listings={filteredListings}
                highlightedId={highlightedId}
                onMarkerHover={handleMarkerHover}
                onBoundsChange={handleBoundsChange}
                showSearchButton={showSearchButton}
                onSearchArea={handleSearchArea}
              />
            </div>
          </div>

          <div className="md:hidden flex-1 relative">
            <ListingsMap
              listings={filteredListings}
              highlightedId={highlightedId}
              onMarkerHover={handleMarkerHover}
              onBoundsChange={handleBoundsChange}
              showSearchButton={showSearchButton}
              onSearchArea={handleSearchArea}
            />

            {!showMobileList && (
              <button
                onClick={() => setShowMobileList(true)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#484848] text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                Show list
              </button>
            )}

            {showMobileList && (
              <>
                <button
                  onClick={() => setShowMobileList(false)}
                  className="absolute top-4 right-4 z-[1001] bg-white p-2 rounded-full shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <MobileListingCards
                  listings={filteredListings}
                  highlightedId={highlightedId}
                  onCardHover={handleCardHover}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
