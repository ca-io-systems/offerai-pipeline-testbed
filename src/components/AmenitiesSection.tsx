'use client'

import { useState } from 'react'
import type { Amenity } from '@/db/schema'
import AmenityIcon from './AmenityIcon'

interface AmenitiesSectionProps {
  amenities: Amenity[]
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const displayAmenities = amenities.slice(0, 10)
  const hasMore = amenities.length > 10

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">What this place offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {displayAmenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-4">
            <AmenityIcon icon={amenity.icon} />
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setModalOpen(true)}
          className="mt-6 rounded-lg border border-[#222222] px-6 py-3 font-medium hover:bg-[#F7F7F7]"
        >
          Show all {amenities.length} amenities
        </button>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">What this place offers</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-4 border-b border-[#EBEBEB] pb-4">
                  <AmenityIcon icon={amenity.icon} />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
