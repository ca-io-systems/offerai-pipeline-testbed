'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'hotel', label: 'Hotel' },
]

const ROOM_TYPES = [
  { value: 'entire', label: 'Entire place' },
  { value: 'private', label: 'Private room' },
  { value: 'shared', label: 'Shared room' },
]

const AMENITIES = [
  { value: 'wifi', label: 'Wifi' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'washer', label: 'Washer' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'air_conditioning', label: 'Air conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'pool', label: 'Pool' },
  { value: 'hot_tub', label: 'Hot tub' },
  { value: 'free_parking', label: 'Free parking' },
  { value: 'ev_charger', label: 'EV charger' },
  { value: 'gym', label: 'Gym' },
  { value: 'dedicated_workspace', label: 'Dedicated workspace' },
  { value: 'pets_allowed', label: 'Pets allowed' },
]

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    searchParams.get('propertyType')?.split(',') || []
  )
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '')
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',') || []
  )
  const [instantBook, setInstantBook] = useState(searchParams.get('instantBook') === 'true')

  useEffect(() => {
    if (isOpen) {
      setMinPrice(searchParams.get('minPrice') || '')
      setMaxPrice(searchParams.get('maxPrice') || '')
      setPropertyTypes(searchParams.get('propertyType')?.split(',').filter(Boolean) || [])
      setRoomType(searchParams.get('roomType') || '')
      setAmenities(searchParams.get('amenities')?.split(',').filter(Boolean) || [])
      setInstantBook(searchParams.get('instantBook') === 'true')
    }
  }, [isOpen, searchParams])

  const handlePropertyTypeChange = useCallback((value: string) => {
    setPropertyTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }, [])

  const handleAmenityChange = useCallback((value: string) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }, [])

  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (minPrice) {
      params.set('minPrice', minPrice)
    } else {
      params.delete('minPrice')
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice)
    } else {
      params.delete('maxPrice')
    }

    if (propertyTypes.length > 0) {
      params.set('propertyType', propertyTypes.join(','))
    } else {
      params.delete('propertyType')
    }

    if (roomType) {
      params.set('roomType', roomType)
    } else {
      params.delete('roomType')
    }

    if (amenities.length > 0) {
      params.set('amenities', amenities.join(','))
    } else {
      params.delete('amenities')
    }

    if (instantBook) {
      params.set('instantBook', 'true')
    } else {
      params.delete('instantBook')
    }

    params.delete('offset')
    router.push(`/search?${params.toString()}`)
    onClose()
  }, [
    searchParams,
    minPrice,
    maxPrice,
    propertyTypes,
    roomType,
    amenities,
    instantBook,
    router,
    onClose,
  ])

  const handleClearAll = useCallback(() => {
    setMinPrice('')
    setMaxPrice('')
    setPropertyTypes([])
    setRoomType('')
    setAmenities([])
    setInstantBook(false)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
          <button onClick={onClose} className="p-2 hover:bg-[#F7F7F7] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="font-semibold text-lg">Filters</h2>
          <div className="w-9" />
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Price range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-[#767676] mb-1 block">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full border border-[#EBEBEB] rounded-lg pl-7 pr-3 py-3 outline-none focus:border-[#484848]"
                  />
                </div>
              </div>
              <span className="text-[#767676] mt-6">—</span>
              <div className="flex-1">
                <label className="text-sm text-[#767676] mb-1 block">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Any"
                    className="w-full border border-[#EBEBEB] rounded-lg pl-7 pr-3 py-3 outline-none focus:border-[#484848]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4">Property type</h3>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    propertyTypes.includes(type.value)
                      ? 'border-[#484848] bg-[#F7F7F7]'
                      : 'border-[#EBEBEB] hover:border-[#484848]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(type.value)}
                    onChange={() => handlePropertyTypeChange(type.value)}
                    className="w-5 h-5 rounded border-[#EBEBEB] text-[#484848] focus:ring-[#484848]"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4">Room type</h3>
            <div className="space-y-3">
              {ROOM_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    roomType === type.value
                      ? 'border-[#484848] bg-[#F7F7F7]'
                      : 'border-[#EBEBEB] hover:border-[#484848]'
                  }`}
                >
                  <input
                    type="radio"
                    name="roomType"
                    checked={roomType === type.value}
                    onChange={() => setRoomType(type.value)}
                    className="w-5 h-5 border-[#EBEBEB] text-[#484848] focus:ring-[#484848]"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity.value}
                  className="flex items-center gap-3 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                    className="w-5 h-5 rounded border-[#EBEBEB] text-[#484848] focus:ring-[#484848]"
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-4">Booking options</h3>
            <label className="flex items-center justify-between p-4 border border-[#EBEBEB] rounded-lg cursor-pointer hover:border-[#484848]">
              <div>
                <p className="font-medium">Instant Book</p>
                <p className="text-sm text-[#767676]">Listings you can book without waiting for host approval</p>
              </div>
              <div
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  instantBook ? 'bg-[#484848]' : 'bg-[#EBEBEB]'
                }`}
                onClick={() => setInstantBook(!instantBook)}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    instantBook ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[#EBEBEB]">
          <button
            onClick={handleClearAll}
            className="text-sm underline hover:text-[#484848]"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-[#484848] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d2d2d] transition-colors"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  )
}
