import Image from 'next/image'

type OptimizedImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  blurDataURL?: string
}

const defaultBlurDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECABEhMf/aAAwDAQACEQMRAD8Az7T9St7XT4IZrKGdkXDyOzhnPskgdjvVj+k6b+j+0pQKSRwMwjuf/9k='

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className = '',
  blurDataURL = defaultBlurDataURL,
}: OptimizedImageProps) {
  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width ?? 400, height: height ?? 300 }

  return (
    <Image
      src={src}
      alt={alt}
      {...imageProps}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}
