import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'OfferBnb - Find your next adventure',
  description: 'Discover unique places to stay around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
              OfferBnb
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#484848] hover:text-[#FF5A5F] font-medium">
                Stays
              </Link>
              <Link href="/" className="text-[#767676] hover:text-[#FF5A5F]">
                Experiences
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#484848] hover:text-[#FF5A5F] text-sm font-medium">
                Become a Host
              </Link>
              <button className="p-2 rounded-full border border-[#EBEBEB] hover:shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-[#F7F7F7] border-t border-[#EBEBEB] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-[#484848] mb-4">Support</h3>
                <ul className="space-y-2 text-[#767676]">
                  <li><Link href="/" className="hover:underline">Help Center</Link></li>
                  <li><Link href="/" className="hover:underline">Safety information</Link></li>
                  <li><Link href="/" className="hover:underline">Cancellation options</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#484848] mb-4">Community</h3>
                <ul className="space-y-2 text-[#767676]">
                  <li><Link href="/" className="hover:underline">Diversity &amp; Belonging</Link></li>
                  <li><Link href="/" className="hover:underline">Against Discrimination</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#484848] mb-4">Hosting</h3>
                <ul className="space-y-2 text-[#767676]">
                  <li><Link href="/" className="hover:underline">Try hosting</Link></li>
                  <li><Link href="/" className="hover:underline">Host resources</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#484848] mb-4">OfferBnb</h3>
                <ul className="space-y-2 text-[#767676]">
                  <li><Link href="/" className="hover:underline">Newsroom</Link></li>
                  <li><Link href="/" className="hover:underline">Careers</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#EBEBEB] text-[#767676] text-sm">
              © 2024 OfferBnb, Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
