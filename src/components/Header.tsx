'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { logout } from '@/actions/auth'

export function Header() {
  const { user, showLoginModal, setUser } = useAuth()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    window.location.reload()
  }

  return (
    <header className="border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/wishlists"
                  className="text-[#484848] hover:text-[#FF5A5F] transition-colors"
                >
                  Wishlists
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-[#767676]">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-[#767676] hover:text-[#484848] text-sm"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={showLoginModal}
                className="text-[#484848] hover:text-[#FF5A5F] transition-colors"
              >
                Log in
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
