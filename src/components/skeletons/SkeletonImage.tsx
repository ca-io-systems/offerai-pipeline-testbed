type SkeletonImageProps = {
  className?: string
  aspectRatio?: 'square' | 'video' | 'portrait'
}

export function SkeletonImage({
  className = '',
  aspectRatio = 'video',
}: SkeletonImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  return (
    <div
      className={`bg-borders animate-pulse rounded-lg ${aspectClasses[aspectRatio]} ${className}`}
    />
  )
}
