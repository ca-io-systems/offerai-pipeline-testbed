'use client'

import { useCallback, useState, useTransition } from 'react'

type UseOptimisticOptions<T, R> = {
  initialValue: T
  onUpdate: (newValue: T) => Promise<R>
  onError?: (error: Error, previousValue: T) => void
}

type UseOptimisticResult<T> = {
  value: T
  isPending: boolean
  error: Error | null
  update: (newValue: T) => void
}

export function useOptimistic<T, R = void>({
  initialValue,
  onUpdate,
  onError,
}: UseOptimisticOptions<T, R>): UseOptimisticResult<T> {
  const [value, setValue] = useState<T>(initialValue)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(
    (newValue: T) => {
      const previousValue = value
      setError(null)
      setValue(newValue)

      startTransition(async () => {
        try {
          await onUpdate(newValue)
        } catch (err) {
          setValue(previousValue)
          const error = err instanceof Error ? err : new Error('Update failed')
          setError(error)
          onError?.(error, previousValue)
        }
      })
    },
    [value, onUpdate, onError]
  )

  return { value, isPending, error, update }
}
