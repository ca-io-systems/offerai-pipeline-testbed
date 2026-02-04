import { SkeletonImage } from './SkeletonImage'
import { SkeletonText } from './SkeletonText'

type SkeletonCardProps = {
  className?: string
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <SkeletonImage aspectRatio="video" />
      <div className="pt-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-2/3 rounded bg-borders animate-pulse" />
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-borders animate-pulse" />
            <div className="h-4 w-8 rounded bg-borders animate-pulse" />
          </div>
        </div>
        <div className="mt-1 h-3 w-1/2 rounded bg-borders animate-pulse" />
        <div className="mt-1 h-3 w-1/3 rounded bg-borders animate-pulse" />
        <div className="mt-2">
          <div className="h-4 w-24 rounded bg-borders animate-pulse" />
        </div>
      </div>
    </div>
  )
}
