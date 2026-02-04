import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OfferBnb',
  description: 'Your home away from home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F7F7] text-[#484848]">
        {children}
      </body>
    </html>
  )
}
