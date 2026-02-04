'use client'

import { useRouter } from 'next/navigation'
import { updateListingStatus, flagListing } from '@/actions/listings'

type Listing = {
  id: number
  title: string
  city: string
  price: number
  status: string
  rating: number | null
  isFlagged: boolean
  imageUrl: string | null
  description: string
  address: string
  createdAt: Date
  hostId: number
  hostName: string | null
  hostEmail: string | null
  reportsCount: number
}

type ListingSlideOverProps = {
  listing: Listing
  onClose: () => void
}

export function ListingSlideOver({ listing, onClose }: ListingSlideOverProps) {
  const router = useRouter()

  const handleStatusChange = async (status: 'pending' | 'approved' | 'suspended') => {
    await updateListingStatus(listing.id, status)
    router.refresh()
    onClose()
  }

  const handleFlag = async () => {
    await flagListing(listing.id)
    router.refresh()
    onClose()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-[#FFB400] text-white',
    approved: 'bg-[#008A05] text-white',
    suspended: 'bg-[#C13515] text-white',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#484848]">Listing Details</h2>
            <button
              onClick={onClose}
              className="text-[#767676] hover:text-[#484848]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image */}
            {listing.imageUrl && (
              <div className="mb-6">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Title and Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-[#484848]">{listing.title}</h3>
                {listing.isFlagged && (
                  <svg className="w-5 h-5 text-[#C13515]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                  </svg>
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${statusColors[listing.status]}`}>
                {listing.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#767676]">Price</p>
                  <p className="text-lg font-semibold text-[#484848]">${listing.price}/night</p>
                </div>
                <div>
                  <p className="text-sm text-[#767676]">Rating</p>
                  <p className="text-lg font-semibold text-[#484848]">
                    {listing.rating ? `${listing.rating.toFixed(1)} ⭐` : 'No ratings'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#767676]">Location</p>
                <p className="text-[#484848]">{listing.address}</p>
                <p className="text-[#484848]">{listing.city}</p>
              </div>

              <div>
                <p className="text-sm text-[#767676]">Description</p>
                <p className="text-[#484848]">{listing.description}</p>
              </div>

              <div className="border-t border-[#EBEBEB] pt-4">
                <p className="text-sm text-[#767676]">Host</p>
                <p className="text-[#484848] font-medium">{listing.hostName}</p>
                <p className="text-sm text-[#767676]">{listing.hostEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#767676]">Reports</p>
                  <p className={`text-lg font-semibold ${listing.reportsCount > 0 ? 'text-[#C13515]' : 'text-[#484848]'}`}>
                    {listing.reportsCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#767676]">Created</p>
                  <p className="text-[#484848]">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-[#EBEBEB] space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={listing.status === 'approved'}
                className="flex-1 px-4 py-2 bg-[#008A05] text-white rounded-md hover:bg-[#007004] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange('suspended')}
                disabled={listing.status === 'suspended'}
                className="flex-1 px-4 py-2 bg-[#C13515] text-white rounded-md hover:bg-[#A12D12] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suspend
              </button>
            </div>
            <button
              onClick={handleFlag}
              className={`w-full px-4 py-2 border rounded-md transition-colors ${
                listing.isFlagged
                  ? 'border-[#008A05] text-[#008A05] hover:bg-[#008A05] hover:text-white'
                  : 'border-[#FFB400] text-[#FFB400] hover:bg-[#FFB400] hover:text-white'
              }`}
            >
              {listing.isFlagged ? 'Remove Flag' : 'Flag for Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
