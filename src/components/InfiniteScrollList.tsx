'use client'

import { ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type InfiniteScrollListProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T, index: number) => string
  isLoading: boolean
  hasMore: boolean
  loadMoreRef: (node: HTMLElement | null) => void
  error: Error | null
  onRetry?: () => void
  className?: string
  emptyMessage?: string
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  keyExtractor,
  isLoading,
  hasMore,
  loadMoreRef,
  error,
  onRetry,
  className = '',
  emptyMessage = 'No items found',
}: InfiniteScrollListProps<T>) {
  if (items.length === 0 && !isLoading) {
    return (
      <div className="py-12 text-center text-secondary-text">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ))}

      {error && (
        <div className="py-8 text-center">
          <p className="text-error">{error.message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {hasMore && !error && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  )
}
