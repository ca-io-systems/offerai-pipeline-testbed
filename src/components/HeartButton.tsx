'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { WishlistModal } from './WishlistModal'

type HeartButtonProps = {
  listingId: string
  initialSaved: boolean
}

export function HeartButton({ listingId, initialSaved }: HeartButtonProps) {
  const { user, showLoginModal } = useAuth()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      showLoginModal()
      return
    }

    setIsModalOpen(true)
  }

  const handleToggle = (saved: boolean) => {
    if (saved !== isSaved) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }
    setIsSaved(saved)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isAnimating ? 'scale-125' : 'scale-100'}`}
          fill={isSaved ? '#FF5A5F' : 'none'}
          viewBox="0 0 24 24"
          stroke={isSaved ? '#FF5A5F' : '#484848'}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <WishlistModal
        listingId={listingId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggle={handleToggle}
      />
    </>
  )
}
