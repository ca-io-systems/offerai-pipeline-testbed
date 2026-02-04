import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OfferBnb',
  description: 'Find unique places to stay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <header className="border-b border-[#EBEBEB] sticky top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-[#FF5A5F] text-2xl font-bold">
              OfferBnb
            </a>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
