import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to OfferBnb</h1>
      <p className="text-[#767676] mb-8">Find your perfect stay anywhere in the world.</p>
      <Link
        href="/dashboard/trips"
        className="inline-block bg-[#FF5A5F] text-white px-6 py-3 rounded-lg hover:bg-[#E04E52] transition-colors"
      >
        View My Trips
      </Link>
    </div>
  )
}
