'use client'

import { useState } from 'react'
import { createWishlist } from '@/actions/wishlists'
import { useRouter } from 'next/navigation'

export function CreateWishlistButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    const result = await createWishlist(name.trim())
    
    if (result.success) {
      setName('')
      setIsOpen(false)
      router.refresh()
    }
    
    setIsCreating(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-[#484848] rounded-lg text-[#484848] hover:bg-[#F7F7F7] transition-colors"
      >
        Create wishlist
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#484848]">Create wishlist</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#767676] hover:text-[#484848]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg mb-4 focus:outline-none focus:border-[#484848]"
                autoFocus
                maxLength={50}
              />
              
              <div className="text-right text-sm text-[#767676] mb-4">
                {name.length}/50 characters
              </div>

              <button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-medium hover:bg-[#FF5A5F]/90 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
