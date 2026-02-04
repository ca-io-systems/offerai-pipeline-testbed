'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Error reported:', error.message, error.digest)
  }

  return (
    <main className="min-h-screen">
      <ErrorDisplay
        title="Something went wrong"
        message="We had trouble loading this page. Please try again."
        onRetry={reset}
        onReport={handleReport}
      />
    </main>
  )
}
