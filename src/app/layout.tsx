import type { Metadata } from 'next'
import './globals.css'
import { getCurrentUser } from '@/lib/auth'
import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'
import { Header } from '@/components/Header'
import { LoginModal } from '@/components/LoginModal'

export const metadata: Metadata = {
  title: 'OfferBnb',
  description: 'Find your perfect stay',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body className="bg-white text-[#484848]">
        <AuthProvider initialUser={user}>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <LoginModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
