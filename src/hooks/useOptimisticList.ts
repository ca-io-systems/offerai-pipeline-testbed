'use client'

import { useCallback, useState, useTransition } from 'react'

type UseOptimisticListOptions<T, R> = {
  initialItems: T[]
  onAdd: (item: T) => Promise<R>
  onError?: (error: Error, item: T) => void
  getId: (item: T) => string
}

type UseOptimisticListResult<T> = {
  items: T[]
  isPending: boolean
  error: Error | null
  addItem: (item: T) => void
  removeItem: (id: string) => void
}

export function useOptimisticList<T, R = void>({
  initialItems,
  onAdd,
  onError,
  getId,
}: UseOptimisticListOptions<T, R>): UseOptimisticListResult<T> {
  const [items, setItems] = useState<T[]>(initialItems)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<Error | null>(null)

  const addItem = useCallback(
    (item: T) => {
      setError(null)
      setItems((prev) => [item, ...prev])

      startTransition(async () => {
        try {
          await onAdd(item)
        } catch (err) {
          setItems((prev) => prev.filter((i) => getId(i) !== getId(item)))
          const error = err instanceof Error ? err : new Error('Failed to add item')
          setError(error)
          onError?.(error, item)
        }
      })
    },
    [onAdd, onError, getId]
  )

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => getId(item) !== id))
    },
    [getId]
  )

  return { items, isPending, error, addItem, removeItem }
}
