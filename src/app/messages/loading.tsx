import { SkeletonProfile, SkeletonText } from '@/components/skeletons'

function SkeletonConversation() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-borders">
      <div className="h-12 w-12 shrink-0 rounded-full bg-borders animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-borders animate-pulse" />
        <div className="mt-1 h-3 w-48 rounded bg-borders animate-pulse" />
      </div>
      <div className="h-3 w-16 rounded bg-borders animate-pulse" />
    </div>
  )
}

export default function MessagesLoading() {
  return (
    <div className="min-h-screen flex">
      <div className="w-80 border-r border-borders">
        <div className="p-4 border-b border-borders">
          <div className="h-6 w-24 rounded bg-borders animate-pulse" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonConversation key={i} />
        ))}
      </div>
      <div className="flex-1 p-6">
        <SkeletonProfile />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`h-12 rounded-2xl bg-borders animate-pulse ${
                  i % 2 === 0 ? 'w-2/3' : 'w-1/2'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
