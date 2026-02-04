import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-[#484848]">
        <header className="border-b border-[#EBEBEB] px-4 py-4">
          <div className="mx-auto max-w-7xl">
            <a href="/" className="text-xl font-bold text-[#FF5A5F]">
              {SITE_NAME}
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-[#EBEBEB] px-4 py-8 text-center text-sm text-[#767676]">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
