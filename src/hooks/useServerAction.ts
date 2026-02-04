'use client'

import { useCallback, useState, useTransition } from 'react'

type UseServerActionOptions<T, R> = {
  action: (data: T) => Promise<R>
  onSuccess?: (result: R) => void
  onError?: (error: Error) => void
}

type UseServerActionResult<T, R> = {
  execute: (data: T) => Promise<R | undefined>
  isPending: boolean
  error: Error | null
  reset: () => void
}

export function useServerAction<T, R>({
  action,
  onSuccess,
  onError,
}: UseServerActionOptions<T, R>): UseServerActionResult<T, R> {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (data: T): Promise<R | undefined> => {
      setError(null)

      return new Promise((resolve) => {
        startTransition(async () => {
          try {
            const result = await action(data)
            onSuccess?.(result)
            resolve(result)
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Action failed')
            setError(error)
            onError?.(error)
            resolve(undefined)
          }
        })
      })
    },
    [action, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { execute, isPending, error, reset }
}
