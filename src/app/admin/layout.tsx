import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For this implementation, we'll verify admin exists and allow access
  // In production, this would check session/cookie authentication
  const admin = await getAdminUser()

  if (!admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <nav className="bg-white border-b border-[#EBEBEB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-[#FF5A5F]">
                OfferBnb Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium text-[#484848] hover:text-[#FF5A5F] hover:bg-[#F7F7F7]"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/listings"
                className="px-3 py-2 rounded-md text-sm font-medium text-[#484848] hover:text-[#FF5A5F] hover:bg-[#F7F7F7]"
              >
                Listings
              </Link>
              <Link
                href="/admin/users"
                className="px-3 py-2 rounded-md text-sm font-medium text-[#484848] hover:text-[#FF5A5F] hover:bg-[#F7F7F7]"
              >
                Users
              </Link>
              <Link
                href="/admin/reports"
                className="px-3 py-2 rounded-md text-sm font-medium text-[#484848] hover:text-[#FF5A5F] hover:bg-[#F7F7F7]"
              >
                Reports
              </Link>
              <Link
                href="/admin/moderation"
                className="px-3 py-2 rounded-md text-sm font-medium text-[#484848] hover:text-[#FF5A5F] hover:bg-[#F7F7F7]"
              >
                Moderation Queue
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-[#767676]">
                {admin.name} ({admin.email})
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
