'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface SwipeableGalleryProps {
  images: string[]
  alt: string
}

export function SwipeableGallery({ images, alt }: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const itemWidth = container.clientWidth
    const newIndex = Math.round(scrollLeft / itemWidth)
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, images.length])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const itemWidth = container.clientWidth
    container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth',
    })
  }, [])

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }, [currentIndex, scrollToIndex])

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentIndex < images.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }, [currentIndex, images.length, scrollToIndex])

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#F7F7F7]">
      {/* Swipeable Container */}
      <div
        ref={scrollContainerRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full snap-center"
          >
            <Image
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className={`object-cover ${isDragging ? 'pointer-events-none' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Desktop Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          aria-label="Previous image"
        >
          <svg className="w-4 h-4 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          aria-label="Next image"
        >
          <svg className="w-4 h-4 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter (Mobile) */}
      <div className="md:hidden absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
        {currentIndex + 1}/{images.length}
      </div>

      {/* Dot Indicators (Mobile) */}
      {images.length > 1 && (
        <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                scrollToIndex(index)
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-2' : 'bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
