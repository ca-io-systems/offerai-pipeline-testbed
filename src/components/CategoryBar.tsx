'use client'

import { useState } from 'react'

const categories = [
  { name: 'Icons', icon: '⭐' },
  { name: 'Beachfront', icon: '🏖️' },
  { name: 'Cabins', icon: '🏕️' },
  { name: 'OMG!', icon: '😲' },
  { name: 'Trending', icon: '🔥' },
  { name: 'Surfing', icon: '🏄' },
  { name: 'Amazing pools', icon: '🏊' },
  { name: 'Countryside', icon: '🌾' },
  { name: 'Lakefront', icon: '🌊' },
  { name: 'Design', icon: '🎨' },
  { name: 'Castles', icon: '🏰' },
  { name: 'Arctic', icon: '❄️' },
]

interface CategoryBarProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export default function CategoryBar({ selectedCategory, onCategorySelect }: CategoryBarProps) {
  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategorySelect(selectedCategory === category.name ? null : category.name)}
              className={`flex flex-col items-center gap-1 min-w-fit pb-2 border-b-2 transition-colors ${
                selectedCategory === category.name
                  ? 'border-[#484848] text-[#484848]'
                  : 'border-transparent text-[#767676] hover:text-[#484848] hover:border-[#EBEBEB]'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
