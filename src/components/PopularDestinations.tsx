'use client'

import Image from 'next/image'
import type { LocationSuggestion } from '@/lib/types'

interface PopularDestinationsProps {
  destinations: LocationSuggestion[]
  onSelect: (location: LocationSuggestion) => void
}

export function PopularDestinations({ destinations, onSelect }: PopularDestinationsProps) {
  if (destinations.length === 0) return null

  return (
    <div className="p-4">
      <div className="text-sm font-semibold text-[#767676] uppercase mb-3">
        Popular Destinations
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {destinations.map((destination) => (
          <button
            key={destination.id}
            type="button"
            className="group text-left rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            onMouseDown={() => onSelect(destination)}
          >
            <div className="relative h-24 w-full">
              {destination.imageUrl ? (
                <Image
                  src={destination.imageUrl}
                  alt={destination.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-[#EBEBEB] flex items-center justify-center">
                  <span className="text-2xl">🏙️</span>
                </div>
              )}
            </div>
            <div className="p-2 bg-white">
              <div className="font-medium text-[#484848] truncate">{destination.city}</div>
              <div className="text-xs text-[#767676] truncate">{destination.country}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
