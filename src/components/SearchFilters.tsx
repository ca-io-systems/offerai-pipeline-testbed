'use client'

import { useState } from 'react'
import type { SearchFilters } from '@/lib/types'

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

const propertyTypes = ['Apartment', 'House', 'Loft', 'Studio', 'Condo', 'Penthouse']

export default function SearchFiltersComponent({ filters, onFiltersChange }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined
    onFiltersChange({ ...filters, minPrice: value })
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined
    onFiltersChange({ ...filters, maxPrice: value })
  }

  const handleBedsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined
    onFiltersChange({ ...filters, beds: value })
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined
    onFiltersChange({ ...filters, type: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.beds !== undefined ||
    filters.type !== undefined

  return (
    <div className="border-b border-[#EBEBEB] bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 border border-[#EBEBEB] rounded-full hover:border-[#484848] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-[#FF5A5F] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#767676] hover:text-[#484848] underline"
            >
              Clear all
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice ?? ''}
                onChange={handleMinPriceChange}
                className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:border-[#484848]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.maxPrice ?? ''}
                onChange={handleMaxPriceChange}
                className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:border-[#484848]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <select
                value={filters.beds ?? ''}
                onChange={handleBedsChange}
                className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:border-[#484848]"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                value={filters.type ?? ''}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:border-[#484848]"
              >
                <option value="">All types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
