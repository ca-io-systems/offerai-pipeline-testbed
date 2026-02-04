import { SkeletonProfile, SkeletonCard, SkeletonText } from '@/components/skeletons'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="h-32 w-32 shrink-0 rounded-full bg-borders animate-pulse" />
          <div className="flex-1 text-center md:text-left">
            <div className="mx-auto h-8 w-48 rounded bg-borders animate-pulse md:mx-0" />
            <div className="mx-auto mt-2 h-4 w-32 rounded bg-borders animate-pulse md:mx-0" />
            <SkeletonText lines={2} className="mt-4" />
          </div>
        </div>
        <div className="mt-8 border-t border-borders pt-8">
          <div className="h-6 w-32 rounded bg-borders animate-pulse" />
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
