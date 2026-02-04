'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiltersModal } from './FiltersModal'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1)
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance')

  const updateSearch = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.delete('offset')
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value)
    },
    []
  )

  const handleLocationBlur = useCallback(() => {
    updateSearch({ location: location || undefined })
  }, [location, updateSearch])

  const handleLocationKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        updateSearch({ location: location || undefined })
      }
    },
    [location, updateSearch]
  )

  const handleCheckInChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckIn(e.target.value)
      updateSearch({ checkIn: e.target.value || undefined })
    },
    [updateSearch]
  )

  const handleCheckOutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckOut(e.target.value)
      updateSearch({ checkOut: e.target.value || undefined })
    },
    [updateSearch]
  )

  const handleGuestDecrement = useCallback(() => {
    const newGuests = Math.max(1, guests - 1)
    setGuests(newGuests)
    updateSearch({ guests: newGuests > 1 ? newGuests.toString() : undefined })
  }, [guests, updateSearch])

  const handleGuestIncrement = useCallback(() => {
    const newGuests = guests + 1
    setGuests(newGuests)
    updateSearch({ guests: newGuests.toString() })
  }, [guests, updateSearch])

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value)
      updateSearch({ sort: e.target.value !== 'relevance' ? e.target.value : undefined })
    },
    [updateSearch]
  )

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const hasActiveFilters =
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('propertyType') ||
    searchParams.has('roomType') ||
    searchParams.has('amenities') ||
    searchParams.has('instantBook')

  return (
    <>
      <div className="bg-white border-b border-[#EBEBEB] sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border border-[#EBEBEB] rounded-lg px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[#767676]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
                onBlur={handleLocationBlur}
                onKeyDown={handleLocationKeyDown}
                className="text-sm outline-none w-24 md:w-32"
              />
            </div>

            <div className="flex items-center gap-2 border border-[#EBEBEB] rounded-lg px-3 py-2">
              <input
                type="date"
                value={checkIn}
                onChange={handleCheckInChange}
                className="text-sm outline-none w-28"
                placeholder="Check in"
              />
            </div>

            <div className="flex items-center gap-2 border border-[#EBEBEB] rounded-lg px-3 py-2">
              <input
                type="date"
                value={checkOut}
                onChange={handleCheckOutChange}
                className="text-sm outline-none w-28"
                placeholder="Check out"
              />
            </div>

            <div className="flex items-center gap-2 border border-[#EBEBEB] rounded-lg px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[#767676]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <button
                onClick={handleGuestDecrement}
                className="w-6 h-6 rounded-full border border-[#EBEBEB] text-[#767676] hover:border-[#484848] text-sm"
              >
                -
              </button>
              <span className="text-sm w-6 text-center">{guests}</span>
              <button
                onClick={handleGuestIncrement}
                className="w-6 h-6 rounded-full border border-[#EBEBEB] text-[#767676] hover:border-[#484848] text-sm"
              >
                +
              </button>
            </div>

            <button
              onClick={openModal}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors ${
                hasActiveFilters
                  ? 'border-[#484848] bg-[#484848] text-white'
                  : 'border-[#EBEBEB] hover:border-[#484848]'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
              Filters
            </button>

            <div className="ml-auto">
              <select
                value={sort}
                onChange={handleSortChange}
                className="border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm outline-none cursor-pointer hover:border-[#484848]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <FiltersModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
