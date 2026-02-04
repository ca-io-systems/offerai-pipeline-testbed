import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OfferBnb - Find Your Perfect Stay',
  description: 'Discover unique accommodations around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        />
      </head>
      <body className="bg-white text-[#484848]">
        <header className="border-b border-[#EBEBEB] px-6 py-4">
          <div className="flex items-center justify-between max-w-[1800px] mx-auto">
            <a href="/" className="text-2xl font-bold text-[#FF5A5F]">
              OfferBnb
            </a>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
