'use client'

import { Suspense } from 'react'
import { SearchBox } from './SearchBox'
import type { LocationSuggestion } from '@/lib/types'

interface SearchBoxWrapperProps {
  popularDestinations: LocationSuggestion[]
}

function SearchBoxSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-16 bg-[#EBEBEB] rounded-lg" />
        <div className="h-16 bg-[#EBEBEB] rounded-lg" />
        <div className="h-16 bg-[#EBEBEB] rounded-lg" />
        <div className="h-16 bg-[#EBEBEB] rounded-lg" />
      </div>
    </div>
  )
}

export function SearchBoxWrapper({ popularDestinations }: SearchBoxWrapperProps) {
  return (
    <Suspense fallback={<SearchBoxSkeleton />}>
      <SearchBox popularDestinations={popularDestinations} />
    </Suspense>
  )
}
