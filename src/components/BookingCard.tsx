'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Calendar, { DateRange, BlockedDateRange } from './Calendar'
import GuestSelector, { GuestCounts } from './GuestSelector'
import PriceBreakdown from './PriceBreakdown'
import { checkAvailability, calculatePrice, type PriceBreakdown as PriceBreakdownType } from '@/actions/booking'
import { formatDate, daysBetween } from '@/lib/dates'

interface BookingCardProps {
  listingId: number
  pricePerNight: number
  cleaningFee: number
  maxGuests: number
  minNights: number
  blockedDates: BlockedDateRange[]
}

type BookingState = 'selecting' | 'checking' | 'available' | 'unavailable'

export default function BookingCard({
  listingId,
  pricePerNight,
  cleaningFee,
  maxGuests,
  minNights,
  blockedDates,
}: BookingCardProps) {
  const router = useRouter()
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({ checkIn: null, checkOut: null })
  const [guests, setGuests] = useState<GuestCounts>({ adults: 1, children: 0, infants: 0 })
  const [bookingState, setBookingState] = useState<BookingState>('selecting')
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestedDates, setSuggestedDates] = useState<{ checkIn: string; checkOut: string }[]>([])

  const hasValidDates = dateRange.checkIn && dateRange.checkOut
  const totalGuests = guests.adults + guests.children

  const nights = useMemo(() => {
    if (!dateRange.checkIn || !dateRange.checkOut) return 0
    return daysBetween(dateRange.checkIn, dateRange.checkOut)
  }, [dateRange])

  const handleRangeChange = useCallback((range: DateRange) => {
    setDateRange(range)
    setBookingState('selecting')
    setError(null)
    setSuggestedDates([])
    setPriceBreakdown(null)
    
    // Close calendar when both dates are selected
    if (range.checkIn && range.checkOut) {
      setShowCalendar(false)
    }
  }, [])

  const handleReserve = useCallback(async () => {
    if (!dateRange.checkIn || !dateRange.checkOut) {
      setShowCalendar(true)
      return
    }

    setBookingState('checking')
    setError(null)

    const checkInStr = formatDate(dateRange.checkIn)
    const checkOutStr = formatDate(dateRange.checkOut)

    // Check availability
    const availability = await checkAvailability(listingId, checkInStr, checkOutStr)

    if (!availability.available) {
      setBookingState('unavailable')
      setError('These dates are not available')
      if (availability.suggestedDates) {
        setSuggestedDates(availability.suggestedDates)
      }
      return
    }

    // Calculate price
    const price = await calculatePrice(listingId, checkInStr, checkOutStr)
    if (price) {
      setPriceBreakdown(price)
      setBookingState('available')
    }
  }, [dateRange, listingId])

  const handleConfirmReservation = useCallback(() => {
    if (!dateRange.checkIn || !dateRange.checkOut) return

    const checkInStr = formatDate(dateRange.checkIn)
    const checkOutStr = formatDate(dateRange.checkOut)
    const guestCount = guests.adults + guests.children

    router.push(`/checkout/${listingId}?checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guestCount}`)
  }, [dateRange, guests, listingId, router])

  const handleSelectSuggestedDate = useCallback((suggestion: { checkIn: string; checkOut: string }) => {
    setDateRange({
      checkIn: new Date(suggestion.checkIn + 'T00:00:00'),
      checkOut: new Date(suggestion.checkOut + 'T00:00:00'),
    })
    setBookingState('selecting')
    setError(null)
    setSuggestedDates([])
  }, [])

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return 'Add date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="border border-[#EBEBEB] rounded-xl p-6 shadow-lg bg-white">
      {/* Price Header */}
      <div className="mb-6">
        <span className="text-xl font-semibold text-[#484848]">${pricePerNight}</span>
        <span className="text-[#767676]"> / night</span>
      </div>

      {/* Date Selection */}
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full border border-[#EBEBEB] rounded-t-lg overflow-hidden hover:border-[#484848] transition-colors"
        >
          <div className="grid grid-cols-2">
            <div className="px-4 py-3 text-left border-r border-[#EBEBEB]">
              <div className="text-xs font-semibold text-[#484848] uppercase">Check-in</div>
              <div className={dateRange.checkIn ? 'text-[#484848]' : 'text-[#767676]'}>
                {formatDisplayDate(dateRange.checkIn)}
              </div>
            </div>
            <div className="px-4 py-3 text-left">
              <div className="text-xs font-semibold text-[#484848] uppercase">Checkout</div>
              <div className={dateRange.checkOut ? 'text-[#484848]' : 'text-[#767676]'}>
                {formatDisplayDate(dateRange.checkOut)}
              </div>
            </div>
          </div>
        </button>

        {showCalendar && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-20 w-[600px] -ml-[100px]">
            <Calendar
              selectedRange={dateRange}
              onRangeChange={handleRangeChange}
              blockedDates={blockedDates}
              minNights={minNights}
            />
          </div>
        )}
      </div>

      {/* Guest Selection */}
      <div className="mb-4">
        <GuestSelector
          guests={guests}
          onGuestsChange={setGuests}
          maxGuests={maxGuests}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-[#FEF2F2] border border-[#C13515] rounded-lg">
          <p className="text-[#C13515] font-medium">{error}</p>
          {suggestedDates.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-[#767676] mb-2">Try these available dates:</p>
              <div className="space-y-2">
                {suggestedDates.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSuggestedDate(suggestion)}
                    className="block w-full text-left px-3 py-2 bg-white border border-[#EBEBEB] rounded-lg hover:border-[#FF5A5F] transition-colors text-sm"
                  >
                    {new Date(suggestion.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' – '}
                    {new Date(suggestion.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown (shown when available) */}
      {bookingState === 'available' && priceBreakdown && (
        <div className="mb-4">
          <PriceBreakdown breakdown={priceBreakdown} />
        </div>
      )}

      {/* Reserve / Confirm Button */}
      {bookingState === 'available' ? (
        <button
          type="button"
          onClick={handleConfirmReservation}
          className="w-full py-3 bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm Reservation
        </button>
      ) : (
        <button
          type="button"
          onClick={handleReserve}
          disabled={bookingState === 'checking'}
          className="w-full py-3 bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {bookingState === 'checking' ? 'Checking availability...' : 'Reserve'}
        </button>
      )}

      {/* Quick Price Estimate */}
      {hasValidDates && bookingState === 'selecting' && (
        <p className="text-center text-sm text-[#767676] mt-3">
          ${pricePerNight} × {nights} night{nights !== 1 ? 's' : ''} = ${pricePerNight * nights}
        </p>
      )}

      {!hasValidDates && (
        <p className="text-center text-sm text-[#767676] mt-3">
          You won&apos;t be charged yet
        </p>
      )}
    </div>
  )
}
