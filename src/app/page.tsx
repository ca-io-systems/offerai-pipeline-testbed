import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-[#FF5A5F] mb-4">OfferBnb</h1>
      <p className="text-[#767676] mb-8">Your home away from home</p>
      <Link
        href="/dashboard/hosting"
        className="bg-[#FF5A5F] text-white px-6 py-3 rounded-lg hover:bg-[#E04E53] transition-colors"
      >
        Host Dashboard
      </Link>
    </main>
  )
}
