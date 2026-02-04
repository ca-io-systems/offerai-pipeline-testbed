'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ListingsError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Listings error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Could not load listings"
        message="We had trouble loading the listings. Please check your connection and try again."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
