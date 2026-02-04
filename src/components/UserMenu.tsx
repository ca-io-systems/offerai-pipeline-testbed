'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[#EBEBEB] p-2 hover:shadow-md transition"
      >
        <HamburgerIcon className="h-4 w-4 text-[#484848]" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#767676]">
          <UserIcon className="h-5 w-5 text-white" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-64 rounded-xl bg-white py-2 shadow-lg border border-[#EBEBEB] z-50">
          <div className="border-b border-[#EBEBEB] pb-2">
            <MenuItem href="/signup" label="Sign up" bold />
            <MenuItem href="/login" label="Log in" />
          </div>
          <div className="pt-2">
            <MenuItem href="/host" label="Airbnb your home" />
            <MenuItem href="/help" label="Help Center" />
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  href: string
  label: string
  bold?: boolean
}

function MenuItem({ href, label, bold }: MenuItemProps) {
  return (
    <a
      href={href}
      className={`block px-4 py-3 text-sm hover:bg-[#F7F7F7] ${
        bold ? 'font-semibold text-[#484848]' : 'text-[#484848]'
      }`}
    >
      {label}
    </a>
  )
}

function HamburgerIcon({ className }: { className?: string }) {
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
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}
