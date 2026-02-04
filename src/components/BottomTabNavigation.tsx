'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    name: 'Explore',
    href: '/',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill="none" stroke={active ? '#FF5A5F' : '#767676'} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    name: 'Wishlists',
    href: '/wishlists',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? '#FF5A5F' : 'none'} stroke={active ? '#FF5A5F' : '#767676'} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: 'Trips',
    href: '/trips',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill="none" stroke={active ? '#FF5A5F' : '#767676'} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    name: 'Inbox',
    href: '/inbox',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill="none" stroke={active ? '#FF5A5F' : '#767676'} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill="none" stroke={active ? '#FF5A5F' : '#767676'} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function BottomTabNavigation() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EBEBEB] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href !== '/' && pathname.startsWith(tab.href))
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 h-full touch-target"
            >
              {tab.icon(isActive)}
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-[#FF5A5F] font-medium' : 'text-[#767676]'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
