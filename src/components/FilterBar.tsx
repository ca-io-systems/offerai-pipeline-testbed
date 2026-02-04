'use client'

import { useState } from 'react'
import { BottomSheet } from './BottomSheet'

const filterCategories = [
  'Price',
  'Type of place',
  'Rooms and beds',
  'Amenities',
  'Booking options',
]

export function FilterBar() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setActiveFilter('Filters')}
          className="flex items-center gap-2 px-4 py-3 border border-[#EBEBEB] rounded-xl hover:border-[#484848] transition-colors flex-shrink-0 touch-target"
        >
          <svg className="w-4 h-4 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-[#484848]">Filters</span>
        </button>

        {filterCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className="px-4 py-3 border border-[#EBEBEB] rounded-xl hover:border-[#484848] transition-colors flex-shrink-0 touch-target"
          >
            <span className="text-sm text-[#484848] whitespace-nowrap">{category}</span>
          </button>
        ))}
      </div>

      <BottomSheet
        isOpen={activeFilter !== null}
        onClose={() => setActiveFilter(null)}
        title={activeFilter || 'Filters'}
        footer={
          <div className="flex items-center gap-3">
            <button className="flex-1 py-3 text-[#484848] font-medium underline">
              Clear all
            </button>
            <button
              onClick={() => setActiveFilter(null)}
              className="flex-1 py-3 bg-[#484848] text-white font-medium rounded-lg hover:bg-[#222222] transition-colors"
            >
              Show places
            </button>
          </div>
        }
      >
        <FilterContent category={activeFilter} />
      </BottomSheet>
    </>
  )
}

function FilterContent({ category }: { category: string | null }) {
  if (category === 'Price') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-[#484848] mb-4">Price range</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-[#767676]">Minimum</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">$</span>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848] text-base touch-target"
                />
              </div>
            </div>
            <span className="text-[#767676] mt-6">–</span>
            <div className="flex-1">
              <label className="text-sm text-[#767676]">Maximum</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">$</span>
                <input
                  type="number"
                  placeholder="1000+"
                  className="w-full pl-8 pr-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848] text-base touch-target"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (category === 'Type of place') {
    return (
      <div className="space-y-4">
        {['Entire place', 'Private room', 'Shared room'].map((type) => (
          <label key={type} className="flex items-center gap-4 p-4 border border-[#EBEBEB] rounded-xl cursor-pointer hover:border-[#484848] transition-colors">
            <input
              type="checkbox"
              className="w-6 h-6 rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F]"
            />
            <div>
              <p className="font-medium text-[#484848]">{type}</p>
              <p className="text-sm text-[#767676]">
                {type === 'Entire place' && 'A place all to yourself'}
                {type === 'Private room' && 'Your own room in a home or hotel'}
                {type === 'Shared room' && 'A sleeping space shared with others'}
              </p>
            </div>
          </label>
        ))}
      </div>
    )
  }

  if (category === 'Rooms and beds') {
    return (
      <div className="space-y-6">
        {['Bedrooms', 'Beds', 'Bathrooms'].map((item) => (
          <div key={item}>
            <h3 className="font-medium text-[#484848] mb-3">{item}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {['Any', '1', '2', '3', '4', '5', '6', '7', '8+'].map((num) => (
                <button
                  key={num}
                  className="px-4 py-2 border border-[#EBEBEB] rounded-full hover:border-[#484848] transition-colors text-sm text-[#484848] touch-target"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="text-center py-8 text-[#767676]">
      Filter options for {category}
    </div>
  )
}
