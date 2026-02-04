import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { BottomTabNavigation } from '@/components/BottomTabNavigation'

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
      <body className="bg-white min-h-screen pb-16 md:pb-0">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <BottomTabNavigation />
      </body>
    </html>
  )
}
