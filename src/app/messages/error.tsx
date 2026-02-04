'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MessagesError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Messages error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Could not load messages"
        message="We had trouble loading your messages. Please check your connection and try again."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
