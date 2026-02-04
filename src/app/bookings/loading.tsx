import { SkeletonImage, SkeletonText } from '@/components/skeletons'

function SkeletonBookingCard() {
  return (
    <div className="flex gap-4 rounded-xl border border-borders p-4">
      <SkeletonImage aspectRatio="square" className="w-24 shrink-0" />
      <div className="flex-1">
        <div className="h-5 w-3/4 rounded bg-borders animate-pulse" />
        <div className="mt-2 h-4 w-1/2 rounded bg-borders animate-pulse" />
        <div className="mt-2 h-4 w-1/3 rounded bg-borders animate-pulse" />
        <div className="mt-3 h-6 w-24 rounded bg-borders animate-pulse" />
      </div>
    </div>
  )
}

export default function BookingsLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="h-8 w-40 rounded bg-borders animate-pulse" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBookingCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
