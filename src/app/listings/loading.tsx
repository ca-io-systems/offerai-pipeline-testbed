import { SkeletonCard } from '@/components/skeletons'

export default function ListingsLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="h-8 w-48 rounded bg-borders animate-pulse" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
