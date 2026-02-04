import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to OfferBnb</h1>
      <p className="text-[#767676] mb-8 text-center max-w-md">
        Discover unique accommodations around the world
      </p>
      <Link
        href="/search"
        className="bg-[#FF5A5F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#e54e52] transition-colors"
      >
        Explore Listings
      </Link>
    </div>
  )
}
