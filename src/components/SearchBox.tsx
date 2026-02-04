'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LocationAutocomplete } from './LocationAutocomplete'
import { DateSelector } from './DateSelector'
import { GuestSelector } from './GuestSelector'
import { RecentSearches } from './RecentSearches'
import { PopularDestinations } from './PopularDestinations'
import type { LocationSuggestion, RecentSearch, FlexibleDateOption } from '@/lib/types'

interface SearchBoxProps {
  popularDestinations: LocationSuggestion[]
}

const RECENT_SEARCHES_KEY = 'offerbnb_recent_searches'
const MAX_RECENT_SEARCHES = 5

function getFlexibleDates(option: FlexibleDateOption): { checkIn: string, checkOut: string } {
  const today = new Date()
  let checkIn: Date
  let checkOut: Date

  switch (option) {
    case 'weekend':
      // Find next Friday
      const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7
      checkIn = new Date(today)
      checkIn.setDate(today.getDate() + daysUntilFriday)
      checkOut = new Date(checkIn)
      checkOut.setDate(checkIn.getDate() + 2) // Sunday
      break
    case 'week':
      checkIn = new Date(today)
      checkIn.setDate(today.getDate() + 1)
      checkOut = new Date(checkIn)
      checkOut.setDate(checkIn.getDate() + 7)
      break
    case 'month':
      checkIn = new Date(today)
      checkIn.setDate(today.getDate() + 1)
      checkOut = new Date(checkIn)
      checkOut.setMonth(checkIn.getMonth() + 1)
      break
    default:
      return { checkIn: '', checkOut: '' }
  }

  return {
    checkIn: checkIn.toISOString().split('T')[0],
    checkOut: checkOut.toISOString().split('T')[0],
  }
}

export function SearchBox({ popularDestinations }: SearchBoxProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [locationId, setLocationId] = useState<number | undefined>(
    searchParams.get('locationId') ? Number(searchParams.get('locationId')) : undefined
  )
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [guests, setGuests] = useState(searchParams.get('guests') ? Number(searchParams.get('guests')) : 1)
  const [flexibleDate, setFlexibleDate] = useState<FlexibleDateOption>(null)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLocationFocused, setIsLocationFocused] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [])

  // Update URL when search params change
  const updateUrl = useCallback((params: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })

    const newUrl = newParams.toString() ? `?${newParams.toString()}` : '/'
    router.push(newUrl, { scroll: false })
  }, [router, searchParams])

  // Handle location selection
  const handleLocationSelect = useCallback((loc: LocationSuggestion) => {
    setLocation(`${loc.city}, ${loc.country}`)
    setLocationId(loc.id)
    setShowSuggestions(false)
    updateUrl({ location: `${loc.city}, ${loc.country}`, locationId: loc.id })
  }, [updateUrl])

  // Handle recent search selection
  const handleRecentSearchSelect = useCallback((search: RecentSearch) => {
    setLocation(search.location)
    setLocationId(search.locationId)
    setCheckIn(search.checkIn || '')
    setCheckOut(search.checkOut || '')
    setGuests(search.guests || 1)
    setShowSuggestions(false)

    updateUrl({
      location: search.location,
      locationId: search.locationId,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: search.guests,
    })
  }, [updateUrl])

  // Handle flexible date selection
  const handleFlexibleDateSelect = useCallback((option: FlexibleDateOption) => {
    setFlexibleDate(option)
    if (option) {
      const { checkIn: newCheckIn, checkOut: newCheckOut } = getFlexibleDates(option)
      setCheckIn(newCheckIn)
      setCheckOut(newCheckOut)
      updateUrl({ checkIn: newCheckIn, checkOut: newCheckOut })
    }
  }, [updateUrl])

  // Handle date changes
  const handleCheckInChange = useCallback((value: string) => {
    setCheckIn(value)
    setFlexibleDate(null)
    updateUrl({ checkIn: value })
  }, [updateUrl])

  const handleCheckOutChange = useCallback((value: string) => {
    setCheckOut(value)
    setFlexibleDate(null)
    updateUrl({ checkOut: value })
  }, [updateUrl])

  // Handle guest changes
  const handleGuestsChange = useCallback((value: number) => {
    setGuests(value)
    updateUrl({ guests: value })
  }, [updateUrl])

  // Handle geolocation
  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser')
      return
    }

    setGeoLoading(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserCoords(coords)
        setLocation('Near me')
        setLocationId(undefined)
        setGeoLoading(false)
        setShowSuggestions(false)

        updateUrl({
          location: 'Near me',
          locationId: undefined,
          latitude: coords.lat,
          longitude: coords.lng,
        })
      },
      (error) => {
        setGeoLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied')
            break
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information unavailable')
            break
          case error.TIMEOUT:
            setGeoError('Location request timed out')
            break
          default:
            setGeoError('An error occurred getting your location')
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }, [updateUrl])

  // Save search to recent searches
  const saveRecentSearch = useCallback((resultCount: number) => {
    if (!location) return

    const newSearch: RecentSearch = {
      location,
      locationId,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests,
      resultCount,
      timestamp: Date.now(),
    }

    const updated = [
      newSearch,
      ...recentSearches.filter(s => s.location !== location),
    ].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }, [location, locationId, checkIn, checkOut, guests, recentSearches])

  // Handle search submit
  const handleSearch = useCallback(() => {
    // The URL is already updated, just need to trigger a search
    // This will be picked up by the page component
    saveRecentSearch(0) // Result count will be updated when results come back
  }, [saveRecentSearch])

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showRecentSearches = isLocationFocused && !location && recentSearches.length > 0
  const showPopularDests = isLocationFocused && !location && recentSearches.length === 0

  return (
    <div ref={containerRef} className="bg-white rounded-xl shadow-lg p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#767676] mb-1">Where</label>
          <LocationAutocomplete
            value={location}
            onChange={(value) => {
              setLocation(value)
              setLocationId(undefined)
              if (value) {
                setShowSuggestions(true)
              }
            }}
            onSelect={handleLocationSelect}
            onFocus={() => {
              setIsLocationFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => setIsLocationFocused(false)}
            showSuggestions={showSuggestions && !!location}
          />

          {/* Near Me Button */}
          <button
            type="button"
            onClick={handleNearMe}
            disabled={geoLoading}
            className="absolute right-2 top-8 text-[#FF5A5F] hover:text-[#E04E53] text-sm font-medium disabled:opacity-50"
          >
            {geoLoading ? '...' : '📍 Near me'}
          </button>

          {geoError && (
            <p className="text-xs text-[#C13515] mt-1">{geoError}</p>
          )}

          {/* Recent Searches Dropdown */}
          {showRecentSearches && (
            <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#EBEBEB]">
              <RecentSearches
                searches={recentSearches}
                onSelect={handleRecentSearchSelect}
              />
            </div>
          )}

          {/* Popular Destinations Dropdown */}
          {showPopularDests && (
            <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#EBEBEB]">
              <PopularDestinations
                destinations={popularDestinations}
                onSelect={handleLocationSelect}
              />
            </div>
          )}
        </div>

        {/* Date Inputs */}
        <DateSelector
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={handleCheckInChange}
          onCheckOutChange={handleCheckOutChange}
          flexibleDate={flexibleDate}
          onFlexibleDateSelect={handleFlexibleDateSelect}
        />

        {/* Guests */}
        <GuestSelector
          value={guests}
          onChange={handleGuestsChange}
        />

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-[#FF5A5F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#E04E53] transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
