import type { Metadata } from 'next'
import './globals.css'
import { NotificationBell } from '@/components/NotificationBell'
import { getUnreadCount } from '@/actions/notifications'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'OfferBnb',
  description: 'Find your perfect stay',
}

async function Header() {
  const unreadCount = await getUnreadCount()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>
          <div className="flex items-center gap-4">
            <NotificationBell initialUnreadCount={unreadCount} />
            <Link
              href="/dashboard/settings/notifications"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
