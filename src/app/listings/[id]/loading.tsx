import { SkeletonImage, SkeletonText, SkeletonProfile } from '@/components/skeletons'

export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="h-8 w-3/4 max-w-xl rounded bg-borders animate-pulse" />
      <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2">
        <SkeletonImage aspectRatio="video" className="rounded-l-xl" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonImage key={i} aspectRatio="video" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkeletonProfile showBio />
          <div className="mt-6 border-t border-borders pt-6">
            <SkeletonText lines={4} />
          </div>
        </div>
        <div className="rounded-xl border border-borders p-6">
          <div className="h-8 w-32 rounded bg-borders animate-pulse" />
          <div className="mt-4 h-12 w-full rounded-lg bg-borders animate-pulse" />
          <div className="mt-4 h-12 w-full rounded-lg bg-borders animate-pulse" />
        </div>
      </div>
    </div>
  )
}
