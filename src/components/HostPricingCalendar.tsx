'use client'

import { useState, useCallback } from 'react'
import type { DatePriceInfo } from '@/lib/pricing'
import { setDatePricing, clearDatePricing } from '@/actions/pricing'

interface PricingMonth {
  year: number
  month: number
  pricing: DatePriceInfo[]
}

interface Props {
  listingId: number
  basePrice: number
  defaultMinimumStay: number
  initialPricingData: PricingMonth[]
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function HostPricingCalendar({
  listingId,
  basePrice,
  defaultMinimumStay,
  initialPricingData,
}: Props) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingData, setPricingData] = useState(initialPricingData)

  const currentData = pricingData[currentMonthIndex]
  const { year, month, pricing } = currentData

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pricingMap = new Map<string, DatePriceInfo>()
  pricing.forEach(p => pricingMap.set(p.date, p))

  const handleDateClick = useCallback((dateStr: string) => {
    setSelectedDates(prev => {
      const next = new Set(prev)
      if (next.has(dateStr)) {
        next.delete(dateStr)
      } else {
        next.add(dateStr)
      }
      return next
    })
  }, [])

  const handleMouseDown = useCallback((dateStr: string) => {
    setIsDragging(true)
    setSelectedDates(new Set([dateStr]))
  }, [])

  const handleMouseEnter = useCallback((dateStr: string) => {
    if (isDragging) {
      setSelectedDates(prev => {
        const next = new Set(prev)
        next.add(dateStr)
        return next
      })
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (selectedDates.size > 0) {
      setShowPricingModal(true)
    }
  }, [selectedDates])

  const handleSetPricing = async (
    price: number | null,
    minimumStay: number | null,
    isAvailable: boolean
  ) => {
    const dates = Array.from(selectedDates)
    await setDatePricing(listingId, dates, price, minimumStay, isAvailable)

    // Update local state
    setPricingData(prev => prev.map(monthData => ({
      ...monthData,
      pricing: monthData.pricing.map(p => {
        if (dates.includes(p.date)) {
          return {
            ...p,
            price: price ?? basePrice,
            minimumStay: minimumStay ?? defaultMinimumStay,
            isAvailable,
            isCustom: price !== null,
          }
        }
        return p
      }),
    })))

    setSelectedDates(new Set())
    setShowPricingModal(false)
  }

  const handleClearPricing = async () => {
    const dates = Array.from(selectedDates)
    await clearDatePricing(listingId, dates)

    setPricingData(prev => prev.map(monthData => ({
      ...monthData,
      pricing: monthData.pricing.map(p => {
        if (dates.includes(p.date)) {
          return {
            ...p,
            price: basePrice,
            minimumStay: defaultMinimumStay,
            isAvailable: true,
            isCustom: false,
          }
        }
        return p
      }),
    })))

    setSelectedDates(new Set())
    setShowPricingModal(false)
  }

  return (
    <div className="border border-[#EBEBEB] rounded-xl p-6" onMouseUp={handleMouseUp}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonthIndex(i => Math.max(0, i - 1))}
          disabled={currentMonthIndex === 0}
          className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-[#F7F7F7]"
        >
          ←
        </button>
        <span className="font-semibold text-lg">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setCurrentMonthIndex(i => Math.min(pricingData.length - 1, i + 1))}
          disabled={currentMonthIndex === pricingData.length - 1}
          className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-[#F7F7F7]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center select-none">
        {DAY_NAMES.map(day => (
          <div key={day} className="py-2 text-[#767676] font-medium text-sm">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dateObj = new Date(year, month, day)
          const priceInfo = pricingMap.get(dateStr)
          const isPast = dateObj < today
          const isSelected = selectedDates.has(dateStr)

          let bgColor = 'bg-green-50 border-green-200 hover:bg-green-100'
          let textColor = 'text-[#484848]'

          if (isPast) {
            bgColor = 'bg-gray-50 border-gray-200'
            textColor = 'text-gray-400'
          } else if (priceInfo && !priceInfo.isAvailable) {
            bgColor = 'bg-red-50 border-red-200 hover:bg-red-100'
          } else if (priceInfo?.isCustom) {
            bgColor = 'bg-blue-50 border-blue-200 hover:bg-blue-100'
          }

          if (isSelected && !isPast) {
            bgColor = 'bg-[#FF5A5F] border-[#FF5A5F]'
            textColor = 'text-white'
          }

          const displayPrice = priceInfo?.price ?? basePrice

          return (
            <div
              key={day}
              onMouseDown={() => !isPast && handleMouseDown(dateStr)}
              onMouseEnter={() => !isPast && handleMouseEnter(dateStr)}
              onClick={() => !isPast && handleDateClick(dateStr)}
              className={`p-1 border rounded ${bgColor} ${textColor} min-h-[70px] flex flex-col items-center justify-center cursor-pointer transition-colors ${isPast ? 'cursor-not-allowed' : ''}`}
            >
              <span className="text-sm font-medium">{day}</span>
              {!isPast && priceInfo?.isAvailable !== false && (
                <span className="text-xs mt-0.5 font-semibold">
                  ${Math.round(displayPrice)}
                </span>
              )}
              {priceInfo?.isAvailable === false && !isPast && (
                <span className="text-xs mt-0.5">Blocked</span>
              )}
              {priceInfo?.minimumStay && priceInfo.minimumStay > 1 && !isPast && priceInfo.isAvailable && (
                <span className="text-[10px] opacity-75">
                  {priceInfo.minimumStay}n min
                </span>
              )}
            </div>
          )
        })}
      </div>

      {showPricingModal && (
        <PricingModal
          selectedDates={Array.from(selectedDates)}
          basePrice={basePrice}
          defaultMinimumStay={defaultMinimumStay}
          onClose={() => {
            setShowPricingModal(false)
            setSelectedDates(new Set())
          }}
          onSetPricing={handleSetPricing}
          onClearPricing={handleClearPricing}
        />
      )}
    </div>
  )
}

interface PricingModalProps {
  selectedDates: string[]
  basePrice: number
  defaultMinimumStay: number
  onClose: () => void
  onSetPricing: (price: number | null, minimumStay: number | null, isAvailable: boolean) => void
  onClearPricing: () => void
}

function PricingModal({
  selectedDates,
  basePrice,
  defaultMinimumStay,
  onClose,
  onSetPricing,
  onClearPricing,
}: PricingModalProps) {
  const [price, setPrice] = useState(basePrice.toString())
  const [minimumStay, setMinimumStay] = useState(defaultMinimumStay.toString())
  const [isAvailable, setIsAvailable] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const priceValue = price ? parseFloat(price) : null
    const minStayValue = minimumStay ? parseInt(minimumStay) : null
    await onSetPricing(priceValue, minStayValue, isAvailable)
    setIsSubmitting(false)
  }

  const handleClear = async () => {
    setIsSubmitting(true)
    await onClearPricing()
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">
          Set Pricing for {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#484848] mb-1">
              Availability
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                  className="accent-[#FF5A5F]"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                  className="accent-[#FF5A5F]"
                />
                <span>Blocked</span>
              </label>
            </div>
          </div>

          {isAvailable && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#484848] mb-1">
                  Price per night ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder={`Base: $${basePrice}`}
                  className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5A5F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#484848] mb-1">
                  Minimum stay (nights)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minimumStay}
                  onChange={e => setMinimumStay(e.target.value)}
                  placeholder={`Default: ${defaultMinimumStay}`}
                  className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5A5F]"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border border-[#EBEBEB] rounded-lg py-2 hover:bg-[#F7F7F7] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            disabled={isSubmitting}
            className="px-4 border border-[#EBEBEB] rounded-lg py-2 hover:bg-[#F7F7F7] disabled:opacity-50 text-[#767676]"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[#FF5A5F] text-white rounded-lg py-2 hover:bg-[#E04E53] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
