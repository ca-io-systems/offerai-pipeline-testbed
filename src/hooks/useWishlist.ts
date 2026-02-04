'use client'

import { useOptimistic } from './useOptimistic'

type UseWishlistOptions = {
  listingId: string
  initialWishlisted: boolean
  onToggle: (listingId: string, wishlisted: boolean) => Promise<void>
  onError?: (error: Error) => void
}

export function useWishlist({
  listingId,
  initialWishlisted,
  onToggle,
  onError,
}: UseWishlistOptions) {
  const { value: isWishlisted, isPending, error, update } = useOptimistic({
    initialValue: initialWishlisted,
    onUpdate: async (newValue) => {
      await onToggle(listingId, newValue)
    },
    onError: (err) => onError?.(err),
  })

  const toggle = () => update(!isWishlisted)

  return { isWishlisted, isPending, error, toggle }
}
