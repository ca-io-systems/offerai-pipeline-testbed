'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  addDays,
  isDateInRange,
} from '@/lib/dates'

export interface DateRange {
  checkIn: Date | null
  checkOut: Date | null
}

export interface BlockedDateRange {
  start: string
  end: string
}

interface CalendarProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
  blockedDates?: BlockedDateRange[]
  minNights?: number
  maxFutureMonths?: number
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function Calendar({
  selectedRange,
  onRangeChange,
  blockedDates = [],
  minNights = 1,
  maxFutureMonths = 12,
}: CalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const maxDate = useMemo(() => {
    const max = new Date(today)
    max.setMonth(max.getMonth() + maxFutureMonths)
    return max
  }, [today, maxFutureMonths])

  const isDateBlocked = useCallback((date: Date): boolean => {
    const dateStr = formatDate(date)
    for (const range of blockedDates) {
      if (dateStr >= range.start && dateStr < range.end) {
        return true
      }
    }
    return false
  }, [blockedDates])

  const isDateDisabled = useCallback((date: Date): boolean => {
    // Past dates are disabled
    if (isBeforeDay(date, today)) return true
    // Future dates beyond max are disabled
    if (isAfterDay(date, maxDate)) return true
    // Blocked dates are disabled
    if (isDateBlocked(date)) return true
    return false
  }, [today, maxDate, isDateBlocked])

  const hasBlockedDateInRange = useCallback((start: Date, end: Date): boolean => {
    let current = new Date(start)
    while (isBeforeDay(current, end)) {
      if (isDateBlocked(current)) return true
      current = addDays(current, 1)
    }
    return false
  }, [isDateBlocked])

  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return

    const { checkIn, checkOut } = selectedRange

    // If no check-in selected, or both are selected, start fresh
    if (!checkIn || (checkIn && checkOut)) {
      onRangeChange({ checkIn: date, checkOut: null })
      return
    }

    // If check-in is selected but no check-out
    if (checkIn && !checkOut) {
      // If clicked date is before or same as check-in, reset to new check-in
      if (isBeforeDay(date, checkIn) || isSameDay(date, checkIn)) {
        onRangeChange({ checkIn: date, checkOut: null })
        return
      }

      // Check minimum nights requirement
      const nights = Math.floor((date.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      if (nights < minNights) {
        return
      }

      // Check for blocked dates in range
      if (hasBlockedDateInRange(checkIn, date)) {
        onRangeChange({ checkIn: date, checkOut: null })
        return
      }

      onRangeChange({ checkIn, checkOut: date })
    }
  }, [selectedRange, onRangeChange, isDateDisabled, minNights, hasBlockedDateInRange])

  const isInSelectedRange = useCallback((date: Date): boolean => {
    const { checkIn, checkOut } = selectedRange
    if (!checkIn || !checkOut) return false
    return isDateInRange(date, checkIn, checkOut) || isSameDay(date, checkIn)
  }, [selectedRange])

  const isRangeStart = useCallback((date: Date): boolean => {
    return selectedRange.checkIn ? isSameDay(date, selectedRange.checkIn) : false
  }, [selectedRange.checkIn])

  const isRangeEnd = useCallback((date: Date): boolean => {
    return selectedRange.checkOut ? isSameDay(date, selectedRange.checkOut) : false
  }, [selectedRange.checkOut])

  const goToPreviousMonth = useCallback(() => {
    setBaseMonth(prev => {
      const newMonth = prev.month - 1
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 }
      }
      return { year: prev.year, month: newMonth }
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setBaseMonth(prev => {
      const newMonth = prev.month + 1
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 }
      }
      return { year: prev.year, month: newMonth }
    })
  }, [])

  const canGoPrevious = useMemo(() => {
    const prevMonth = baseMonth.month - 1
    const prevYear = prevMonth < 0 ? baseMonth.year - 1 : baseMonth.year
    const prevMonthNorm = prevMonth < 0 ? 11 : prevMonth
    const firstOfPrev = new Date(prevYear, prevMonthNorm, 1)
    return !isBeforeDay(firstOfPrev, new Date(today.getFullYear(), today.getMonth(), 1))
  }, [baseMonth, today])

  const canGoNext = useMemo(() => {
    const nextMonth = baseMonth.month + 2
    const nextYear = nextMonth > 11 ? baseMonth.year + 1 : baseMonth.year
    const nextMonthNorm = nextMonth > 11 ? nextMonth - 12 : nextMonth
    const firstOfNext = new Date(nextYear, nextMonthNorm, 1)
    return isBeforeDay(firstOfNext, maxDate)
  }, [baseMonth, maxDate])

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return (
      <div className="w-full">
        <div className="text-center font-semibold text-[#484848] mb-4">
          {getMonthName(month)} {year}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-xs text-[#767676] font-medium py-2">
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-10" />
            }

            const disabled = isDateDisabled(date)
            const blocked = isDateBlocked(date)
            const inRange = isInSelectedRange(date)
            const isStart = isRangeStart(date)
            const isEnd = isRangeEnd(date)

            return (
              <button
                key={formatDate(date)}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={`
                  h-10 w-full rounded-full text-sm font-medium transition-colors
                  ${disabled && blocked ? 'text-gray-300 line-through cursor-not-allowed' : ''}
                  ${disabled && !blocked ? 'text-gray-300 cursor-not-allowed' : ''}
                  ${!disabled && !inRange && !isStart && !isEnd ? 'text-[#484848] hover:border hover:border-[#484848]' : ''}
                  ${inRange && !isStart && !isEnd ? 'bg-[#FFE4E6] text-[#484848]' : ''}
                  ${isStart || isEnd ? 'bg-[#FF5A5F] text-white' : ''}
                `}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const secondMonth = baseMonth.month + 1
  const secondYear = secondMonth > 11 ? baseMonth.year + 1 : baseMonth.year
  const secondMonthNorm = secondMonth > 11 ? 0 : secondMonth

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className={`p-2 rounded-full ${canGoPrevious ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className={`p-2 rounded-full ${canGoNext ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex gap-8">
        {renderMonth(baseMonth.year, baseMonth.month)}
        {renderMonth(secondYear, secondMonthNorm)}
      </div>
      {minNights > 1 && (
        <p className="text-sm text-[#767676] mt-4 text-center">
          Minimum stay: {minNights} nights
        </p>
      )}
    </div>
  )
}
