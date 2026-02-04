'use client'

import { useState } from 'react'
import type { DatePriceInfo } from '@/lib/pricing'

interface Props {
  currentMonthPricing: DatePriceInfo[]
  nextMonthPricing: DatePriceInfo[]
  basePrice: number
  currentYear: number
  currentMonth: number
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ListingCalendar({
  currentMonthPricing,
  nextMonthPricing,
  basePrice,
  currentYear,
  currentMonth,
}: Props) {
  const [viewMonth, setViewMonth] = useState(0) // 0 = current, 1 = next

  const pricing = viewMonth === 0 ? currentMonthPricing : nextMonthPricing
  const year = viewMonth === 0 ? currentYear : (currentMonth === 11 ? currentYear + 1 : currentYear)
  const month = viewMonth === 0 ? currentMonth : (currentMonth + 1) % 12

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pricingMap = new Map<string, DatePriceInfo>()
  pricing.forEach(p => pricingMap.set(p.date, p))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth(0)}
          disabled={viewMonth === 0}
          className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-[#F7F7F7]"
        >
          ←
        </button>
        <span className="font-semibold">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setViewMonth(1)}
          disabled={viewMonth === 1}
          className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-[#F7F7F7]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {DAY_NAMES.map(day => (
          <div key={day} className="py-2 text-[#767676] font-medium">
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

          let bgColor = 'bg-green-50 border-green-200'
          let textColor = 'text-[#484848]'

          if (isPast) {
            bgColor = 'bg-gray-50 border-gray-200'
            textColor = 'text-gray-400'
          } else if (priceInfo && !priceInfo.isAvailable) {
            bgColor = 'bg-red-50 border-red-200'
          } else if (priceInfo?.isCustom) {
            bgColor = 'bg-blue-50 border-blue-200'
          }

          const displayPrice = priceInfo?.price ?? basePrice
          const showPriceChange = priceInfo && priceInfo.price !== basePrice && !isPast

          return (
            <div
              key={day}
              className={`p-1 border rounded ${bgColor} ${textColor} min-h-[60px] flex flex-col items-center justify-center`}
            >
              <span className="text-xs font-medium">{day}</span>
              {!isPast && priceInfo?.isAvailable !== false && (
                <span className="text-xs mt-0.5">
                  ${Math.round(displayPrice)}
                </span>
              )}
              {showPriceChange && (
                <span className="text-[10px] text-[#767676] line-through">
                  ${basePrice}
                </span>
              )}
              {priceInfo?.minimumStay && priceInfo.minimumStay > 1 && !isPast && (
                <span className="text-[10px] text-[#767676]">
                  {priceInfo.minimumStay}n min
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
