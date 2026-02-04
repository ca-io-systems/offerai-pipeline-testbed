'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ListingPhoto } from '@/db/schema'
import Lightbox from './Lightbox'

interface PhotoGalleryProps {
  photos: ListingPhoto[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const displayPhotos = photos.slice(0, 5)

  return (
    <>
      <div className="relative grid h-[400px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl md:h-[500px]">
        {/* Large main photo */}
        {displayPhotos[0] && (
          <button
            onClick={() => openLightbox(0)}
            className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden"
          >
            <Image
              src={displayPhotos[0].url}
              alt="Main photo"
              fill
              className="object-cover transition-opacity hover:opacity-90"
              priority
            />
          </button>
        )}

        {/* 4 smaller photos */}
        {displayPhotos.slice(1, 5).map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index + 1)}
            className="relative cursor-pointer overflow-hidden"
          >
            <Image
              src={photo.url}
              alt={`Photo ${index + 2}`}
              fill
              className="object-cover transition-opacity hover:opacity-90"
            />
          </button>
        ))}

        {/* Show all photos button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 rounded-lg border border-[#222222] bg-white px-4 py-2 text-sm font-medium hover:bg-[#F7F7F7]"
        >
          Show all photos
        </button>
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setCurrentIndex}
        />
      )}
    </>
  )
}
