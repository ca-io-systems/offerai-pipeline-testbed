import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OfferBnb',
  description: 'Find your perfect stay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <header className="border-b border-[#EBEBEB] px-6 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-[#FF5A5F]">
              OfferBnb
            </a>
            <div className="flex items-center gap-6">
              <a href="/host/calendar" className="text-[#484848] hover:text-[#FF5A5F]">
                Host Dashboard
              </a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
