'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MobileSearchOverlay } from './MobileSearchOverlay'

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-[#FF5A5F]"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M16 1c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 2c7.18 0 13 5.82 13 13s-5.82 13-13 13S3 23.18 3 16 8.82 3 16 3zm-1 5v8H9v2h6v6h2v-6h6v-2h-6V8h-2z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-[#FF5A5F] hidden sm:block">
                OfferBnb
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <button className="w-full flex items-center gap-3 px-4 py-2 border border-[#EBEBEB] rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-4 h-4 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-[#484848]">Start your search</span>
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden flex-1 mx-4 flex items-center gap-3 px-4 py-2 border border-[#EBEBEB] rounded-full shadow-sm"
            >
              <svg className="w-4 h-4 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-[#484848]">Where to?</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/host" className="text-sm font-medium text-[#484848] hover:text-[#FF5A5F]">
                Become a Host
              </Link>
              <button className="p-2 rounded-full hover:bg-[#F7F7F7]">
                <svg className="w-5 h-5 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-[#EBEBEB] rounded-full hover:shadow-md transition-shadow">
                <svg className="w-5 h-5 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="w-8 h-8 bg-[#767676] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </button>
            </nav>

            {/* Mobile User Avatar */}
            <button className="md:hidden flex items-center justify-center w-10 h-10 bg-[#767676] rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <MobileSearchOverlay onClose={() => setShowMobileSearch(false)} />
      )}
    </>
  )
}
