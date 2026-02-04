'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SearchError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Search error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Search failed"
        message="We had trouble loading search results. Please try again or adjust your search criteria."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
