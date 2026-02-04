'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { searchLocations } from '@/actions/search'
import type { LocationSuggestion } from '@/lib/types'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (location: LocationSuggestion) => void
  onFocus?: () => void
  onBlur?: () => void
  showSuggestions: boolean
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <span className="bg-yellow-200 font-semibold">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  )
}

export function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  onFocus,
  onBlur,
  showSuggestions,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value || value.length < 1) {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(value)
        setSuggestions(results)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error searching locations:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setSuggestions([])
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [showSuggestions, suggestions, selectedIndex, onSelect])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search destinations"
        className="w-full px-4 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent pr-20"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#EBEBEB] max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-[#F7F7F7] ${
                index === selectedIndex ? 'bg-[#F7F7F7]' : ''
              }`}
              onMouseDown={() => onSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#767676]">📍</span>
                <div>
                  <div className="font-medium">
                    {highlightMatch(suggestion.city, value)}
                  </div>
                  <div className="text-sm text-[#767676]">
                    {suggestion.region && `${suggestion.region}, `}
                    {highlightMatch(suggestion.country, value)}
                  </div>
                </div>
              </div>
              <span className="text-sm text-[#767676] bg-[#F7F7F7] px-2 py-1 rounded">
                {suggestion.listingCount} {suggestion.listingCount === 1 ? 'listing' : 'listings'}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-24 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[#FF5A5F] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
