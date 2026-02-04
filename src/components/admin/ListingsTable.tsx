'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ListingSlideOver } from './ListingSlideOver'
import { bulkUpdateListings, flagListing } from '@/actions/listings'

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

type ListingsTableProps = {
  listings: Listing[]
  cities: string[]
  initialSearch?: string
  initialStatus?: string
  initialCity?: string
}

export function ListingsTable({
  listings,
  cities,
  initialSearch = '',
  initialStatus = 'all',
  initialCity = 'all',
}: ListingsTableProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [city, setCity] = useState(initialCity)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    if (city !== 'all') params.set('city', city)
    router.push(`/admin/listings?${params.toString()}`)
  }

  const handleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(listings.map(l => l.id))
    }
  }

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = async (action: 'approve' | 'suspend' | 'delete') => {
    if (selectedIds.length === 0) return
    await bulkUpdateListings(selectedIds, action)
    setSelectedIds([])
    router.refresh()
  }

  const handleFlag = async (id: number) => {
    await flagListing(id)
    router.refresh()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-[#FFB400] text-white',
    approved: 'bg-[#008A05] text-white',
    suspended: 'bg-[#C13515] text-white',
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#484848] mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-[#484848] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-[#484848] mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
            >
              <option value="all">All Cities</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#FF5A5F] text-white rounded-md hover:bg-[#E04E52] transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-4 flex items-center justify-between">
          <span className="text-sm text-[#484848]">
            {selectedIds.length} listing{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('approve')}
              className="px-3 py-1.5 bg-[#008A05] text-white text-sm rounded-md hover:bg-[#007004] transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-3 py-1.5 bg-[#FFB400] text-white text-sm rounded-md hover:bg-[#E0A000] transition-colors"
            >
              Suspend
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 bg-[#C13515] text-white text-sm rounded-md hover:bg-[#A12D12] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === listings.length && listings.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-[#EBEBEB]"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Host</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">City</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Rating</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Reports</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr
                key={listing.id}
                className={`border-b border-[#EBEBEB] hover:bg-[#F7F7F7] cursor-pointer ${listing.isFlagged ? 'bg-red-50' : ''}`}
                onClick={() => setSelectedListing(listing)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(listing.id)}
                    onChange={() => handleSelect(listing.id)}
                    className="rounded border-[#EBEBEB]"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {listing.isFlagged && (
                      <svg className="w-4 h-4 text-[#C13515]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                      </svg>
                    )}
                    <span className="text-sm text-[#484848]">{listing.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#767676]">{listing.hostName}</td>
                <td className="px-4 py-3 text-sm text-[#767676]">{listing.city}</td>
                <td className="px-4 py-3 text-sm text-[#484848]">${listing.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${statusColors[listing.status]}`}>
                    {listing.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#484848]">
                  {listing.rating ? listing.rating.toFixed(1) : '-'}
                </td>
                <td className="px-4 py-3">
                  {listing.reportsCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#C13515] text-white">
                      {listing.reportsCount}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#767676]">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleFlag(listing.id)}
                    className={`text-sm ${listing.isFlagged ? 'text-[#008A05]' : 'text-[#C13515]'} hover:underline`}
                  >
                    {listing.isFlagged ? 'Unflag' : 'Flag'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {listings.length === 0 && (
          <div className="p-8 text-center text-[#767676]">
            No listings found matching your filters.
          </div>
        )}
      </div>

      {/* Slide Over */}
      {selectedListing && (
        <ListingSlideOver
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  )
}
