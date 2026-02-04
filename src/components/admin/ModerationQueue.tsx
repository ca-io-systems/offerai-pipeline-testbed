'use client'

import { useRouter } from 'next/navigation'
import { updateListingStatus, flagListing, deleteListing } from '@/actions/listings'

type Listing = {
  id: number
  title: string
  description: string
  city: string
  address: string
  price: number
  imageUrl: string | null
  status: string
  isFlagged: boolean
  createdAt: Date
  hostId: number
  hostName: string | null
  hostEmail: string | null
}

type ModerationQueueProps = {
  listings: Listing[]
}

export function ModerationQueue({ listings }: ModerationQueueProps) {
  const router = useRouter()

  const handleApprove = async (id: number) => {
    await updateListingStatus(id, 'approved')
    await flagListing(id) // Remove flag if flagged
    router.refresh()
  }

  const handleReject = async (id: number) => {
    await updateListingStatus(id, 'suspended')
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await deleteListing(id)
      router.refresh()
    }
  }

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-[#008A05] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-[#484848] mb-2">All Caught Up!</h3>
        <p className="text-[#767676]">No listings pending review or flagged for attention.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
            listing.isFlagged ? 'border-[#C13515]' : 'border-[#EBEBEB]'
          }`}
        >
          <div className="flex">
            {/* Image */}
            <div className="w-48 h-48 flex-shrink-0">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F7F7F7] flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#EBEBEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {listing.isFlagged && (
                      <svg className="w-5 h-5 text-[#C13515]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                      </svg>
                    )}
                    <h3 className="text-lg font-semibold text-[#484848]">{listing.title}</h3>
                  </div>
                  <p className="text-sm text-[#767676]">
                    {listing.city} • ${listing.price}/night
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                  listing.status === 'pending' ? 'bg-[#FFB400] text-white' :
                  listing.status === 'approved' ? 'bg-[#008A05] text-white' :
                  'bg-[#C13515] text-white'
                }`}>
                  {listing.status}
                </span>
              </div>

              <p className="text-sm text-[#484848] mb-3 line-clamp-2">
                {listing.description}
              </p>

              <div className="text-xs text-[#767676] mb-3">
                <span>Host: {listing.hostName}</span>
                <span className="mx-2">•</span>
                <span>{listing.hostEmail}</span>
                <span className="mx-2">•</span>
                <span>Submitted: {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(listing.id)}
                  className="px-4 py-2 bg-[#008A05] text-white text-sm font-medium rounded-md hover:bg-[#007004] transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(listing.id)}
                  className="px-4 py-2 bg-[#FFB400] text-white text-sm font-medium rounded-md hover:bg-[#E0A000] transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="px-4 py-2 border border-[#C13515] text-[#C13515] text-sm font-medium rounded-md hover:bg-[#C13515] hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
