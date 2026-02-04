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
      <body className="bg-white text-[#484848]">
        <header className="border-b border-[#EBEBEB] px-6 py-4">
          <a href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </a>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
