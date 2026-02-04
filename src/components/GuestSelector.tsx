'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface GuestCounts {
  adults: number
  children: number
  infants: number
}

interface GuestSelectorProps {
  guests: GuestCounts
  onGuestsChange: (guests: GuestCounts) => void
  maxGuests: number
}

export default function GuestSelector({
  guests,
  onGuestsChange,
  maxGuests,
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalGuests = guests.adults + guests.children
  const canAddMore = totalGuests < maxGuests

  const updateGuests = useCallback((type: keyof GuestCounts, delta: number) => {
    const newGuests = { ...guests }
    const newValue = newGuests[type] + delta

    // Validation
    if (type === 'adults') {
      if (newValue < 1) return // At least 1 adult required
      if (newValue + guests.children > maxGuests) return
    } else if (type === 'children') {
      if (newValue < 0) return
      if (guests.adults + newValue > maxGuests) return
    } else if (type === 'infants') {
      if (newValue < 0 || newValue > 5) return // Max 5 infants
    }

    newGuests[type] = newValue
    onGuestsChange(newGuests)
  }, [guests, onGuestsChange, maxGuests])

  const guestLabel = () => {
    const parts: string[] = []
    const total = guests.adults + guests.children
    parts.push(`${total} guest${total !== 1 ? 's' : ''}`)
    if (guests.infants > 0) {
      parts.push(`${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`)
    }
    return parts.join(', ')
  }

  const renderCounter = (
    label: string,
    description: string,
    value: number,
    onDecrement: () => void,
    onIncrement: () => void,
    canDecrement: boolean,
    canIncrement: boolean
  ) => (
    <div className="flex items-center justify-between py-4 border-b border-[#EBEBEB] last:border-0">
      <div>
        <div className="font-medium text-[#484848]">{label}</div>
        <div className="text-sm text-[#767676]">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            canDecrement
              ? 'border-[#767676] text-[#767676] hover:border-[#484848] hover:text-[#484848]'
              : 'border-[#EBEBEB] text-[#EBEBEB] cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-6 text-center text-[#484848]">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            canIncrement
              ? 'border-[#767676] text-[#767676] hover:border-[#484848] hover:text-[#484848]'
              : 'border-[#EBEBEB] text-[#EBEBEB] cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg text-left hover:border-[#484848] transition-colors"
      >
        <div className="text-xs font-semibold text-[#484848] uppercase">Guests</div>
        <div className="text-[#484848]">{guestLabel()}</div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-10 p-4">
          {renderCounter(
            'Adults',
            'Age 13+',
            guests.adults,
            () => updateGuests('adults', -1),
            () => updateGuests('adults', 1),
            guests.adults > 1,
            canAddMore
          )}
          {renderCounter(
            'Children',
            'Ages 2–12',
            guests.children,
            () => updateGuests('children', -1),
            () => updateGuests('children', 1),
            guests.children > 0,
            canAddMore
          )}
          {renderCounter(
            'Infants',
            'Under 2',
            guests.infants,
            () => updateGuests('infants', -1),
            () => updateGuests('infants', 1),
            guests.infants > 0,
            guests.infants < 5
          )}
          <p className="text-xs text-[#767676] mt-4">
            This place has a maximum of {maxGuests} guests, not including infants.
          </p>
        </div>
      )}
    </div>
  )
}
