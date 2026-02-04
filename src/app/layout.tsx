import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'

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
      <body className="min-h-screen bg-[#F7F7F7]">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
