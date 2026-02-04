'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Header() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests > 1) params.set('guests', guests.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-white border border-[#EBEBEB] rounded-full shadow-sm px-2 py-1">
            <input
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 text-sm border-none outline-none w-32 lg:w-40"
            />
            <div className="h-6 w-px bg-[#EBEBEB]" />
            <input
              type="date"
              placeholder="Check in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="px-2 py-2 text-sm border-none outline-none w-32"
            />
            <div className="h-6 w-px bg-[#EBEBEB]" />
            <input
              type="date"
              placeholder="Check out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="px-2 py-2 text-sm border-none outline-none w-32"
            />
            <div className="h-6 w-px bg-[#EBEBEB]" />
            <div className="flex items-center gap-2 px-2">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 rounded-full border border-[#EBEBEB] text-[#767676] hover:border-[#484848]"
              >
                -
              </button>
              <span className="text-sm w-8 text-center">{guests}</span>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-6 h-6 rounded-full border border-[#EBEBEB] text-[#767676] hover:border-[#484848]"
              >
                +
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#FF5A5F] text-white rounded-full p-2 hover:bg-[#E04E53] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => router.push('/search')}
            className="md:hidden bg-[#FF5A5F] text-white rounded-full px-4 py-2 text-sm hover:bg-[#E04E53] transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  )
}
