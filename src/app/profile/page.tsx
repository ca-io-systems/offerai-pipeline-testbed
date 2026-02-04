import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
  { name: 'Personal info', href: '/profile/personal-info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: 'Login & security', href: '/profile/security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { name: 'Payments & payouts', href: '/profile/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { name: 'Notifications', href: '/profile/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { name: 'Privacy & sharing', href: '/profile/privacy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
]

const hostingItems = [
  { name: 'Switch to hosting', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'List your space', href: '/host', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
]

export default function ProfilePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#484848] mb-6">Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-[#EBEBEB] p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="https://picsum.photos/seed/profile/100/100"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-[#484848]">John Doe</h2>
            <p className="text-[#767676]">Show profile</p>
          </div>
          <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden mb-6">
        <h3 className="text-sm font-semibold text-[#484848] uppercase px-4 pt-4 pb-2">Settings</h3>
        {menuItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F7] transition-colors touch-target ${
              index !== menuItems.length - 1 ? 'border-b border-[#EBEBEB]' : ''
            }`}
          >
            <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="flex-1 text-[#484848]">{item.name}</span>
            <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Hosting Menu */}
      <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden mb-6">
        <h3 className="text-sm font-semibold text-[#484848] uppercase px-4 pt-4 pb-2">Hosting</h3>
        {hostingItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F7] transition-colors touch-target ${
              index !== hostingItems.length - 1 ? 'border-b border-[#EBEBEB]' : ''
            }`}
          >
            <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="flex-1 text-[#484848]">{item.name}</span>
            <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Support */}
      <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden mb-6">
        <h3 className="text-sm font-semibold text-[#484848] uppercase px-4 pt-4 pb-2">Support</h3>
        <Link
          href="/help"
          className="flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F7] transition-colors touch-target border-b border-[#EBEBEB]"
        >
          <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1 text-[#484848]">Get help</span>
          <svg className="w-5 h-5 text-[#767676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <button className="flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F7] transition-colors touch-target w-full text-left">
          <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="flex-1 text-[#484848]">Log out</span>
        </button>
      </div>
    </div>
  )
}
