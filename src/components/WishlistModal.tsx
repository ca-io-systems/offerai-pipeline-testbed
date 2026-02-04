'use client'

import { useState, useEffect } from 'react'
import { getListingWishlists, toggleWishlistItem, createWishlist } from '@/actions/wishlists'
import { useToast } from './Toast'

type WishlistOption = {
  wishlistId: string
  name: string
  hasListing: boolean
}

type WishlistModalProps = {
  listingId: string
  isOpen: boolean
  onClose: () => void
  onToggle: (saved: boolean) => void
}

export function WishlistModal({ listingId, isOpen, onClose, onToggle }: WishlistModalProps) {
  const [wishlists, setWishlists] = useState<WishlistOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadWishlists()
    }
  }, [isOpen, listingId])

  const loadWishlists = async () => {
    setIsLoading(true)
    const data = await getListingWishlists(listingId)
    setWishlists(data)
    setIsLoading(false)
  }

  const handleToggle = async (wishlistId: string, wishlistName: string, currentlyHas: boolean) => {
    const result = await toggleWishlistItem(listingId, wishlistId)
    
    if (result.success) {
      setWishlists((prev) =>
        prev.map((w) =>
          w.wishlistId === wishlistId ? { ...w, hasListing: !currentlyHas } : w
        )
      )
      
      const anySaved = wishlists.some((w) =>
        w.wishlistId === wishlistId ? !currentlyHas : w.hasListing
      )
      onToggle(anySaved)

      if (result.added) {
        showToast(`Saved to ${wishlistName}`, async () => {
          await toggleWishlistItem(listingId, wishlistId)
          await loadWishlists()
          const updatedAnySaved = wishlists.some((w) =>
            w.wishlistId === wishlistId ? false : w.hasListing
          )
          onToggle(updatedAnySaved)
        })
      } else {
        showToast(`Removed from ${wishlistName}`, async () => {
          await toggleWishlistItem(listingId, wishlistId)
          await loadWishlists()
          onToggle(true)
        })
      }
    }
  }

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWishlistName.trim()) return

    setIsCreating(true)
    const result = await createWishlist(newWishlistName.trim())
    
    if (result.success && result.wishlistId) {
      // Add to the new wishlist
      await toggleWishlistItem(listingId, result.wishlistId)
      showToast(`Saved to ${newWishlistName}`)
      onToggle(true)
      setNewWishlistName('')
      setShowCreateForm(false)
      await loadWishlists()
    }
    
    setIsCreating(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-semibold text-[#484848]">Save to wishlist</h2>
          <button
            onClick={onClose}
            className="text-[#767676] hover:text-[#484848]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8 text-[#767676]">Loading...</div>
          ) : (
            <div className="space-y-2">
              {wishlists.map((wishlist) => (
                <button
                  key={wishlist.wishlistId}
                  onClick={() => handleToggle(wishlist.wishlistId, wishlist.name, wishlist.hasListing)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F7F7F7] transition-colors"
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    wishlist.hasListing ? 'bg-[#FF5A5F] border-[#FF5A5F]' : 'border-[#767676]'
                  }`}>
                    {wishlist.hasListing && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[#484848]">{wishlist.name}</span>
                </button>
              ))}

              {showCreateForm ? (
                <form onSubmit={handleCreateWishlist} className="p-3">
                  <input
                    type="text"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                    placeholder="Wishlist name"
                    className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg mb-2 focus:outline-none focus:border-[#484848]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewWishlistName('')
                      }}
                      className="flex-1 py-2 border border-[#484848] rounded-lg text-[#484848]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || !newWishlistName.trim()}
                      className="flex-1 py-2 bg-[#FF5A5F] text-white rounded-lg disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F7F7F7] transition-colors text-[#484848]"
                >
                  <div className="w-6 h-6 rounded border-2 border-dashed border-[#767676] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#767676]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Create new wishlist</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
