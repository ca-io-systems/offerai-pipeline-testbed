'use client'

import { useState } from 'react'
import CategoryBar from './CategoryBar'
import ListingCard from './ListingCard'
import type { Listing } from '@/db/schema'

interface HomeContentProps {
  listings: Listing[]
}

export default function HomeContent({ listings }: HomeContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredListings = selectedCategory
    ? listings.filter((listing) => listing.category === selectedCategory)
    : listings

  return (
    <>
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-[#484848] mb-6">Popular destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.slice(0, 12).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        {filteredListings.length === 0 && (
          <p className="text-center text-[#767676] py-12">
            No listings found for this category.
          </p>
        )}
      </section>
    </>
  )
}
