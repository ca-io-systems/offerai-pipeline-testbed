'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { removeFromWishlist, updateWishlist, deleteWishlist } from '@/actions/wishlists'
import { useToast } from '@/components/Toast'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/db/schema'

type WishlistItem = Listing & { addedAt: Date }

type WishlistDetail = {
  id: string
  name: string
  userId: string
  isPublic: boolean
  shareToken: string | null
  items: WishlistItem[]
  isOwner: boolean
}

type WishlistDetailClientProps = {
  wishlist: WishlistDetail
  isOwner: boolean
}

export function WishlistDetailClient({ wishlist: initialWishlist, isOwner }: WishlistDetailClientProps) {
  const [wishlist, setWishlist] = useState(initialWishlist)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(wishlist.name)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleRemove = async (listingId: string, listingTitle: string) => {
    const result = await removeFromWishlist(listingId, wishlist.id)
    
    if (result.success) {
      setWishlist((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== listingId),
      }))
      showToast(`Removed from ${wishlist.name}`)
    }
  }

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === wishlist.name) {
      setIsEditingName(false)
      setEditedName(wishlist.name)
      return
    }

    const result = await updateWishlist(wishlist.id, editedName.trim())
    
    if (result.success) {
      setWishlist((prev) => ({ ...prev, name: editedName.trim() }))
      setIsEditingName(false)
      showToast('Wishlist renamed')
    }
  }

  const handleDelete = async () => {
    const result = await deleteWishlist(wishlist.id)
    
    if (result.success) {
      router.push('/wishlists')
      showToast('Wishlist deleted')
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/wishlists/shared/${wishlist.shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/wishlists"
          className="text-[#767676] hover:text-[#484848]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        
        {isEditingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-semibold text-[#484848] border-b-2 border-[#484848] focus:outline-none bg-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName()
                if (e.key === 'Escape') {
                  setIsEditingName(false)
                  setEditedName(wishlist.name)
                }
              }}
            />
            <button
              onClick={handleSaveName}
              className="text-[#008A05] hover:text-[#008A05]/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-2xl font-semibold text-[#484848]">{wishlist.name}</h1>
            {isOwner && (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[#767676] hover:text-[#484848]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        )}

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 border border-[#484848] rounded-lg text-[#484848] hover:bg-[#F7F7F7] transition-colors"
            >
              Share
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-[#C13515] text-[#C13515] rounded-lg hover:bg-[#C13515]/10 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-[#767676] mb-6">{wishlist.items.length} saved</p>

      {wishlist.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#767676]">No listings saved yet</p>
          <Link href="/" className="text-[#FF5A5F] hover:underline mt-2 inline-block">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((listing) => (
            <div key={listing.id} className="group relative">
              <Link href={`/listings/${listing.id}`} className="block">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[#484848] truncate">{listing.title}</h3>
                  <p className="text-[#767676] text-sm">{listing.location}</p>
                  <p className="text-[#484848] mt-1">
                    <span className="font-semibold">{formatPrice(listing.price)}</span>
                    <span className="text-[#767676]"> night</span>
                  </p>
                </div>
              </Link>
              
              {isOwner && (
                <button
                  onClick={() => handleRemove(listing.id, listing.title)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#484848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-[#484848] mb-2">Delete this wishlist?</h2>
            <p className="text-[#767676] mb-4">
              &quot;{wishlist.name}&quot; will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-[#484848] rounded-lg text-[#484848]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-[#C13515] text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#484848]">Share wishlist</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#767676] hover:text-[#484848]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-[#767676] mb-4">
              Anyone with the link can view this wishlist.
            </p>

            <button
              onClick={handleShare}
              className="w-full py-3 bg-[#FF5A5F] text-white rounded-lg font-medium hover:bg-[#FF5A5F]/90"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
