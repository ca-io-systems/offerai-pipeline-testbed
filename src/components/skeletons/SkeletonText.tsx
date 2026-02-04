type SkeletonTextProps = {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 1, className = '' }: SkeletonTextProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded bg-borders animate-pulse ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          } ${i > 0 ? 'mt-2' : ''}`}
        />
      ))}
    </div>
  )
}
