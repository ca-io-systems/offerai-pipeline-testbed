import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-2xl font-bold tracking-tight" style={{ color: '#FF5A5F' }}>
        offerbnb
      </span>
    </Link>
  )
}
