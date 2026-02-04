import Link from 'next/link'
import { getUnreadCount } from '@/actions/messages'

export async function Header() {
  const unreadCount = await getUnreadCount()

  return (
    <header className="bg-white border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
          OfferBnb
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/messages"
            className="relative text-[#484848] hover:text-[#FF5A5F] transition-colors"
          >
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-[#FF5A5F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
