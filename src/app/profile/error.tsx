'use client'

import { ErrorDisplay } from '@/components/ErrorDisplay'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProfileError({ error, reset }: ErrorProps) {
  const handleReport = () => {
    console.error('Profile error reported:', error.message, error.digest)
  }

  return (
    <div className="min-h-screen">
      <ErrorDisplay
        title="Could not load profile"
        message="We had trouble loading the profile. Please try again later."
        onRetry={reset}
        onReport={handleReport}
      />
    </div>
  )
}
