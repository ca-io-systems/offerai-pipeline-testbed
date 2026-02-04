'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ListingPhoto } from '@/db/schema'

interface LightboxProps {
  photos: ListingPhoto[]
  currentIndex: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const goToPrevious = useCallback(() => {
    onIndexChange(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)
  }, [currentIndex, photos.length, onIndexChange])

  const goToNext = useCallback(() => {
    onIndexChange(currentIndex === photos.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, photos.length, onIndexChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goToPrevious, goToNext])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 text-white">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Previous button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Previous photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Main image */}
      <div className="relative h-[80vh] w-[90vw] max-w-6xl">
        <Image
          src={photos[currentIndex].url}
          alt={`Photo ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Next button */}
      <button
        onClick={goToNext}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Next photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}
