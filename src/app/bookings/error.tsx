'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BookingsError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Bookings error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Could not load bookings"
        message="We had trouble loading your bookings. Please try again."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
