import Link from 'next/link'

type NotFoundDisplayProps = {
  title?: string
  message?: string
  suggestions?: { label: string; href: string }[]
}

export function NotFoundDisplay({
  title = 'Page not found',
  message = "We couldn't find what you're looking for.",
  suggestions = [
    { label: 'Go to homepage', href: '/' },
    { label: 'Browse listings', href: '/listings' },
  ],
}: NotFoundDisplayProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-6xl font-bold text-borders">404</div>
      <h1 className="text-2xl font-semibold text-dark-text">{title}</h1>
      <p className="mt-2 max-w-md text-secondary-text">{message}</p>
      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.href}
              href={suggestion.href}
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {suggestion.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
