'use client'

import { useState } from 'react'
import SearchPanel from './SearchPanel'

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsExpanded(true)}
        className="hidden md:flex items-center gap-1 rounded-full border border-[#EBEBEB] px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <span className="text-sm font-medium text-[#484848]">Anywhere</span>
        <span className="h-6 w-px bg-[#EBEBEB]" />
        <span className="text-sm font-medium text-[#484848]">Any week</span>
        <span className="h-6 w-px bg-[#EBEBEB]" />
        <span className="text-sm text-[#767676]">Add guests</span>
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5A5F]">
          <SearchIcon className="h-4 w-4 text-white" />
        </div>
      </button>

      <button
        onClick={() => setIsExpanded(true)}
        className="flex md:hidden items-center gap-3 rounded-full border border-[#EBEBEB] px-4 py-3 shadow-sm w-full max-w-md"
      >
        <SearchIcon className="h-5 w-5 text-[#484848]" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-[#484848]">Where to?</span>
          <span className="text-xs text-[#767676]">Anywhere · Any week · Add guests</span>
        </div>
      </button>

      {isExpanded && <SearchPanel onClose={() => setIsExpanded(false)} />}
    </>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
