'use client'

type ErrorDisplayProps = {
  title?: string
  message?: string
  onRetry?: () => void
  onReport?: () => void
  showReport?: boolean
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  onReport,
  showReport = true,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-error/10 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-8 w-8 text-error"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-dark-text">{title}</h2>
      <p className="mt-2 max-w-md text-secondary-text">{message}</p>
      <div className="mt-6 flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        )}
        {showReport && onReport && (
          <button
            onClick={onReport}
            className="rounded-lg border border-borders px-6 py-2.5 font-medium text-dark-text hover:bg-background transition-colors"
          >
            Report issue
          </button>
        )}
      </div>
    </div>
  )
}
