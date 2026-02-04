'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseInfiniteScrollOptions<T> = {
  initialItems: T[]
  fetchMore: (cursor: string | null) => Promise<{ items: T[]; nextCursor: string | null }>
  initialCursor?: string | null
  pageSize?: number
}

type UseInfiniteScrollResult<T> = {
  items: T[]
  isLoading: boolean
  hasMore: boolean
  error: Error | null
  loadMoreRef: (node: HTMLElement | null) => void
  reset: () => void
}

export function useInfiniteScroll<T>({
  initialItems,
  fetchMore,
  initialCursor = null,
  pageSize = 20,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>(initialItems)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialItems.length >= pageSize)
  const [error, setError] = useState<Error | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const { items: newItems, nextCursor } = await fetchMore(cursor)
      setItems((prev) => [...prev, ...newItems])
      setCursor(nextCursor)
      setHasMore(nextCursor !== null && newItems.length >= pageSize)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'))
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [cursor, fetchMore, hasMore, pageSize])

  const loadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMore()
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      )

      observerRef.current.observe(node)
    },
    [hasMore, loadMore]
  )

  const reset = useCallback(() => {
    setItems(initialItems)
    setCursor(initialCursor)
    setHasMore(initialItems.length >= pageSize)
    setError(null)
  }, [initialItems, initialCursor, pageSize])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMoreRef,
    reset,
  }
}
