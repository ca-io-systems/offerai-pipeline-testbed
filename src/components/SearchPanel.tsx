'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchPanelProps {
  onClose: () => void
}

type Tab = 'where' | 'checkin' | 'checkout' | 'who'

export default function SearchPanel({ onClose }: SearchPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('where')
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(0)

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/25"
      onClick={handleBackdropClick}
    >
      <div className="absolute left-0 right-0 top-0 bg-white pt-4 pb-6 shadow-lg">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 flex justify-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-[#F7F7F7]"
              aria-label="Close search"
            >
              <CloseIcon className="h-4 w-4 text-[#484848]" />
            </button>
          </div>

          <div className="rounded-full border border-[#EBEBEB] bg-[#F7F7F7] p-1 shadow-sm">
            <div className="flex items-center">
              <TabButton
                active={activeTab === 'where'}
                onClick={() => setActiveTab('where')}
                label="Where"
                value={location || 'Search destinations'}
              />
              <div className="h-8 w-px bg-[#EBEBEB]" />
              <TabButton
                active={activeTab === 'checkin'}
                onClick={() => setActiveTab('checkin')}
                label="Check in"
                value={checkIn || 'Add dates'}
              />
              <div className="h-8 w-px bg-[#EBEBEB]" />
              <TabButton
                active={activeTab === 'checkout'}
                onClick={() => setActiveTab('checkout')}
                label="Check out"
                value={checkOut || 'Add dates'}
              />
              <div className="h-8 w-px bg-[#EBEBEB]" />
              <TabButton
                active={activeTab === 'who'}
                onClick={() => setActiveTab('who')}
                label="Who"
                value={guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}
              />
              <button className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5A5F] hover:bg-[#E04E52] transition">
                <SearchIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'where' && (
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-[#EBEBEB]">
                <label className="mb-2 block text-xs font-semibold uppercase text-[#484848]">
                  Where to?
                </label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-[#EBEBEB] px-4 py-3 text-[#484848] placeholder:text-[#767676] focus:border-[#484848] focus:outline-none"
                />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {['Flexible', 'Europe', 'Asia', 'USA', 'Caribbean', 'South America'].map((region) => (
                    <button
                      key={region}
                      onClick={() => setLocation(region === 'Flexible' ? '' : region)}
                      className="flex flex-col items-center rounded-xl border border-[#EBEBEB] p-4 hover:border-[#484848] transition"
                    >
                      <div className="mb-2 h-12 w-12 rounded-lg bg-[#F7F7F7]" />
                      <span className="text-sm text-[#484848]">{region}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'checkin' || activeTab === 'checkout') && (
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-[#EBEBEB]">
                <label className="mb-2 block text-xs font-semibold uppercase text-[#484848]">
                  {activeTab === 'checkin' ? 'Check in' : 'Check out'}
                </label>
                <input
                  type="date"
                  value={activeTab === 'checkin' ? checkIn : checkOut}
                  onChange={(e) =>
                    activeTab === 'checkin'
                      ? setCheckIn(e.target.value)
                      : setCheckOut(e.target.value)
                  }
                  className="w-full rounded-lg border border-[#EBEBEB] px-4 py-3 text-[#484848] focus:border-[#484848] focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'who' && (
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-[#EBEBEB]">
                <label className="mb-4 block text-xs font-semibold uppercase text-[#484848]">
                  Who&apos;s coming?
                </label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#484848]">Guests</p>
                    <p className="text-sm text-[#767676]">Add guests</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests(Math.max(0, guests - 1))}
                      disabled={guests === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#767676] text-[#767676] hover:border-[#484848] hover:text-[#484848] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-[#484848]">{guests}</span>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#767676] text-[#767676] hover:border-[#484848] hover:text-[#484848]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  label: string
  value: string
}

function TabButton({ active, onClick, label, value }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-3 text-left transition ${
        active ? 'bg-white shadow-md' : 'hover:bg-[#EBEBEB]'
      }`}
    >
      <p className="text-xs font-semibold text-[#484848]">{label}</p>
      <p className="truncate text-sm text-[#767676]">{value}</p>
    </button>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
