'use client'

import { useState } from 'react'
import type { FlexibleDateOption } from '@/lib/types'

interface DateSelectorProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  flexibleDate: FlexibleDateOption
  onFlexibleDateSelect: (option: FlexibleDateOption) => void
}

const flexibleOptions: { value: FlexibleDateOption, label: string, description: string }[] = [
  { value: 'weekend', label: 'Weekend', description: 'Fri - Sun' },
  { value: 'week', label: 'Week', description: '7 days' },
  { value: 'month', label: 'Month', description: '30 days' },
]

export function DateSelector({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  flexibleDate,
  onFlexibleDateSelect,
}: DateSelectorProps) {
  const [showFlexible, setShowFlexible] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="md:col-span-2 grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium text-[#767676] mb-1">Check in</label>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => onCheckInChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#767676] mb-1">Check out</label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || today}
          onChange={(e) => onCheckOutChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
        />
      </div>

      {/* Flexible Dates Toggle */}
      <div className="col-span-2">
        <button
          type="button"
          onClick={() => setShowFlexible(!showFlexible)}
          className="text-sm text-[#FF5A5F] hover:underline"
        >
          {showFlexible ? 'Use specific dates' : "I'm flexible"}
        </button>

        {showFlexible && (
          <div className="mt-2 flex gap-2">
            {flexibleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFlexibleDateSelect(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  flexibleDate === option.value
                    ? 'border-[#FF5A5F] bg-[#FFF5F5] text-[#FF5A5F]'
                    : 'border-[#EBEBEB] hover:border-[#FF5A5F]'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-[#767676]">{option.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
