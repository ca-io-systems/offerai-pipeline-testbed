'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('')

  return (
    <div className="bg-white rounded-full shadow-lg flex flex-col md:flex-row items-stretch md:items-center p-2 max-w-4xl w-full">
      <div className="flex-1 px-4 py-2 md:border-r border-[#EBEBEB]">
        <label className="block text-xs font-bold text-[#484848]">Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-sm text-[#767676] outline-none bg-transparent"
        />
      </div>
      <div className="flex-1 px-4 py-2 md:border-r border-[#EBEBEB]">
        <label className="block text-xs font-bold text-[#484848]">Check in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full text-sm text-[#767676] outline-none bg-transparent"
        />
      </div>
      <div className="flex-1 px-4 py-2 md:border-r border-[#EBEBEB]">
        <label className="block text-xs font-bold text-[#484848]">Check out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full text-sm text-[#767676] outline-none bg-transparent"
        />
      </div>
      <div className="flex-1 px-4 py-2 flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-xs font-bold text-[#484848]">Who</label>
          <input
            type="text"
            placeholder="Add guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full text-sm text-[#767676] outline-none bg-transparent"
          />
        </div>
        <button className="bg-[#FF5A5F] text-white p-3 rounded-full hover:bg-[#E54A4F] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
