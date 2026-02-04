'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ListingWithStats, updateListingStatus, deleteListing } from '@/actions/listings'

type Props = {
  initialListings: ListingWithStats[]
}

function StatusBadge({ status }: { status: 'published' | 'draft' | 'paused' }) {
  const colors = {
    published: 'bg-[#008A05] text-white',
    draft: 'bg-[#767676] text-white',
    paused: 'bg-[#FFB400] text-white',
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${colors[status]}`}>
      {status}
    </span>
  )
}

function ListingCard({
  listing,
  onStatusChange,
  onDelete,
}: {
  listing: ListingWithStats
  onStatusChange: (id: string, status: 'published' | 'draft' | 'paused') => void
  onDelete: (id: string) => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const handleTogglePause = useCallback(() => {
    const newStatus = listing.status === 'paused' ? 'published' : 'paused'
    onStatusChange(listing.id, newStatus)
  }, [listing.id, listing.status, onStatusChange])
  
  const handleDelete = useCallback(() => {
    onDelete(listing.id)
    setShowDeleteConfirm(false)
  }, [listing.id, onDelete])
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden">
      <div className="relative h-48">
        <Image
          src={listing.coverImage || 'https://picsum.photos/800/600'}
          alt={listing.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{listing.title}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#FF5A5F] font-bold">${listing.pricePerNight}/night</span>
          {listing.rating && (
            <span className="text-sm text-[#767676]">
              ★ {listing.rating.toFixed(1)} ({listing.reviewCount})
            </span>
          )}
        </div>
        
        <div className="text-sm text-[#767676] mb-4">
          {listing.viewCount?.toLocaleString() || 0} views
        </div>
        
        <div className="flex gap-2">
          <Link
            href={`/host/edit/${listing.id}`}
            className="flex-1 px-3 py-2 bg-[#FF5A5F] text-white text-center text-sm rounded hover:bg-[#E04E53] transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleTogglePause}
            className="flex-1 px-3 py-2 border border-[#EBEBEB] text-sm rounded hover:bg-[#F7F7F7] transition-colors"
          >
            {listing.status === 'paused' ? 'Unpause' : 'Pause'}
          </button>
        </div>
        
        <div className="mt-2 relative">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-3 py-2 text-[#C13515] text-sm hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 bg-[#C13515] text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 border border-[#EBEBEB] text-sm rounded hover:bg-[#F7F7F7] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ListingsTab({ initialListings }: Props) {
  const [listings, setListings] = useState(initialListings)
  
  const handleStatusChange = useCallback(async (id: string, status: 'published' | 'draft' | 'paused') => {
    await updateListingStatus(id, status)
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }, [])
  
  const handleDelete = useCallback(async (id: string) => {
    await deleteListing(id)
    setListings(prev => prev.filter(l => l.id !== id))
  }, [])
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <Link
          href="/host/create"
          className="px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E04E53] transition-colors"
        >
          Create new listing
        </Link>
      </div>
      
      {listings.length === 0 ? (
        <div className="text-center py-12 text-[#767676]">
          <p className="mb-4">You don&apos;t have any listings yet.</p>
          <Link
            href="/host/create"
            className="text-[#FF5A5F] hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
