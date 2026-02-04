'use client'

import type { RecentSearch } from '@/lib/types'

interface RecentSearchesProps {
  searches: RecentSearch[]
  onSelect: (search: RecentSearch) => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null

  return (
    <div className="p-2">
      <div className="px-2 py-1 text-xs font-semibold text-[#767676] uppercase">
        Recent Searches
      </div>
      <ul>
        {searches.map((search, index) => (
          <li
            key={`${search.location}-${search.timestamp}`}
            className="px-3 py-2 cursor-pointer hover:bg-[#F7F7F7] rounded-lg"
            onMouseDown={() => onSelect(search)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#767676]">🕒</span>
                <div>
                  <div className="font-medium text-[#484848]">{search.location}</div>
                  <div className="text-sm text-[#767676]">
                    {search.checkIn && search.checkOut
                      ? `${formatDate(search.checkIn)} - ${formatDate(search.checkOut)}`
                      : 'Any dates'
                    }
                    {' · '}
                    {search.guests || 1} {(search.guests || 1) === 1 ? 'guest' : 'guests'}
                  </div>
                </div>
              </div>
              <span className="text-sm text-[#767676]">
                {search.resultCount} {search.resultCount === 1 ? 'result' : 'results'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
