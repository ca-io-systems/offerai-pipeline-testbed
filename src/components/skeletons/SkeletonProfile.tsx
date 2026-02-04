import { SkeletonText } from './SkeletonText'

type SkeletonProfileProps = {
  showBio?: boolean
  className?: string
}

export function SkeletonProfile({
  showBio = false,
  className = '',
}: SkeletonProfileProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="h-12 w-12 shrink-0 rounded-full bg-borders animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-borders animate-pulse" />
        <div className="mt-2 h-3 w-24 rounded bg-borders animate-pulse" />
        {showBio && <SkeletonText lines={2} className="mt-3" />}
      </div>
    </div>
  )
}
