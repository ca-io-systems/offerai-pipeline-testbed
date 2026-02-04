'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import type { Category } from '@/db/schema'

type CategoryNavProps = {
  categories: Category[]
  activeSlug?: string
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const hasOverflow = el.scrollWidth > el.clientWidth
    const scrollLeft = el.scrollLeft
    const maxScroll = el.scrollWidth - el.clientWidth

    setShowLeftArrow(hasOverflow && scrollLeft > 0)
    setShowRightArrow(hasOverflow && scrollLeft < maxScroll - 1)
  }, [])

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [checkOverflow])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = 200
    const newScrollLeft = direction === 'left' 
      ? el.scrollLeft - scrollAmount 
      : el.scrollLeft + scrollAmount

    el.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  const handleScroll = () => {
    checkOverflow()
  }

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#EBEBEB] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-8 overflow-x-auto scrollbar-hide py-4 px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isActive = category.slug === activeSlug
          return (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all ${
                isActive
                  ? 'border-[#484848] text-[#484848]'
                  : 'border-transparent text-[#767676] hover:border-[#EBEBEB] hover:text-[#484848]'
              }`}
            >
              <CategoryIcon icon={category.icon} size={24} />
              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
            </a>
          )
        })}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#EBEBEB] rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
