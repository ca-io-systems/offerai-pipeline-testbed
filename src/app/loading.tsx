import { SkeletonCard } from '@/components/skeletons'

export default function HomeLoading() {
  return (
    <main className="min-h-screen p-8">
      <div className="h-8 w-64 rounded bg-borders animate-pulse" />
      <div className="mt-4 h-4 w-48 rounded bg-borders animate-pulse" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  )
}
