'use client'

import { useState } from 'react'

interface BookingCardProps {
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  maxGuests: number
  avgRating: number
  reviewCount: number
}

export default function BookingCard({
  pricePerNight,
  cleaningFee,
  serviceFee,
  maxGuests,
  avgRating,
  reviewCount,
}: BookingCardProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false)

  // Calculate nights
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const nightlyTotal = pricePerNight * nights
  const total = nightlyTotal + cleaningFee + serviceFee

  return (
    <div className="sticky top-6 rounded-xl border border-[#EBEBEB] p-6 shadow-lg">
      {/* Price header */}
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <span className="text-xl font-semibold">${pricePerNight}</span>
          <span className="text-[#767676]"> night</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span>★</span>
          <span className="font-medium">{avgRating.toFixed(2)}</span>
          <span className="text-[#767676]">· {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Date and guest inputs */}
      <div className="mb-4 overflow-hidden rounded-lg border border-[#767676]">
        <div className="grid grid-cols-2">
          <div className="border-r border-[#767676] p-3">
            <label className="block text-xs font-semibold uppercase">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold uppercase">Checkout</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="relative border-t border-[#767676]">
          <button
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="w-full p-3 text-left"
          >
            <label className="block text-xs font-semibold uppercase">Guests</label>
            <span className="text-sm">{guests} guest{guests !== 1 ? 's' : ''}</span>
          </button>
          {guestDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-10 rounded-b-lg border border-t-0 border-[#767676] bg-white p-4">
              <div className="flex items-center justify-between">
                <span>Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#767676] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                    disabled={guests >= maxGuests}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#767676] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => setGuestDropdownOpen(false)}
                className="mt-4 w-full text-right text-sm font-semibold underline"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reserve button */}
      <button className="w-full rounded-lg bg-[#FF5A5F] py-3 font-semibold text-white hover:bg-[#E04950]">
        Reserve
      </button>

      {nights > 0 && (
        <>
          <p className="mt-4 text-center text-sm text-[#767676]">
            You won&apos;t be charged yet
          </p>

          {/* Price breakdown */}
          <div className="mt-4 space-y-3 border-t border-[#EBEBEB] pt-4">
            <div className="flex justify-between">
              <span className="underline">
                ${pricePerNight} x {nights} night{nights !== 1 ? 's' : ''}
              </span>
              <span>${nightlyTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Cleaning fee</span>
              <span>${cleaningFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between border-t border-[#EBEBEB] pt-3 font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
