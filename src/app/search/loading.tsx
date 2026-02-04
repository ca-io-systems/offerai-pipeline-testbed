import { SkeletonCard } from '@/components/skeletons'

export default function SearchLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 rounded bg-borders animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-borders animate-pulse" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
