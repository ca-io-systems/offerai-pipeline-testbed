import { ReactNode, Suspense } from 'react'
import { SkeletonCard, SkeletonText } from './skeletons'

type DynamicSectionProps = {
  children: ReactNode
  fallbackType?: 'cards' | 'text' | 'custom'
  customFallback?: ReactNode
  cardCount?: number
  textLines?: number
}

function DefaultCardsFallback({ count = 4 }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

function DefaultTextFallback({ lines = 3 }: { lines: number }) {
  return <SkeletonText lines={lines} />
}

export function DynamicSection({
  children,
  fallbackType = 'cards',
  customFallback,
  cardCount = 4,
  textLines = 3,
}: DynamicSectionProps) {
  const getFallback = () => {
    if (customFallback) return customFallback
    if (fallbackType === 'cards') return <DefaultCardsFallback count={cardCount} />
    if (fallbackType === 'text') return <DefaultTextFallback lines={textLines} />
    return null
  }

  return <Suspense fallback={getFallback()}>{children}</Suspense>
}
