'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ListingDetailError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Listing detail error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Could not load this listing"
        message="We had trouble loading the listing details. The listing may have been removed or there might be a temporary issue."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
