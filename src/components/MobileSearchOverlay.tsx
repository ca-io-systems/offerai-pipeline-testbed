'use client'

import { useState } from 'react'

interface MobileSearchOverlayProps {
  onClose: () => void
}

const recentSearches = [
  { location: 'New York', dates: 'Any week', guests: 'Add guests' },
  { location: 'Los Angeles', dates: 'Dec 15-20', guests: '2 guests' },
  { location: 'Miami Beach', dates: 'Any week', guests: 'Add guests' },
]

const suggestions = [
  { title: 'Nearby', subtitle: "I'm flexible" },
  { title: 'Beach', subtitle: 'Popular destinations' },
  { title: 'Mountain', subtitle: 'Escape to nature' },
  { title: 'City', subtitle: 'Urban adventures' },
]

export function MobileSearchOverlay({ onClose }: MobileSearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="fixed inset-0 z-50 bg-white animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-[#EBEBEB]">
          <button
            onClick={onClose}
            className="touch-target flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where to?"
              className="w-full px-4 py-3 bg-[#F7F7F7] rounded-full text-[#484848] placeholder-[#767676] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Searches */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-[#484848] mb-3">Recent searches</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[#F7F7F7] transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-[#EBEBEB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#484848] truncate">{search.location}</p>
                    <p className="text-sm text-[#767676] truncate">
                      {search.dates} · {search.guests}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="p-4 border-t border-[#EBEBEB]">
            <h3 className="text-sm font-semibold text-[#484848] mb-3">Suggestions</h3>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center p-4 rounded-xl border border-[#EBEBEB] hover:border-[#484848] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-[#FF5A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-[#484848]">{suggestion.title}</span>
                  <span className="text-xs text-[#767676]">{suggestion.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBEBEB] bg-white">
          <div className="flex items-center gap-3">
            <button className="flex-1 py-3 text-[#484848] font-medium underline">
              Clear all
            </button>
            <button className="flex-1 py-3 bg-[#FF5A5F] text-white font-medium rounded-lg hover:bg-[#E04E52] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
