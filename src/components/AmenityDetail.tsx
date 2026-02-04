import { AmenityIcon } from './AmenityIcon'
import type { Amenity } from '@/db/schema'

type AmenityDetailProps = {
  amenity: Pick<Amenity, 'name' | 'icon'>
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: { icon: 16, text: 'text-sm' },
  md: { icon: 20, text: 'text-base' },
  lg: { icon: 24, text: 'text-lg' },
}

export function AmenityDetail({ amenity, size = 'md' }: AmenityDetailProps) {
  const { icon: iconSize, text: textClass } = sizeClasses[size]

  return (
    <div className="flex items-center gap-2 text-[#484848]">
      <AmenityIcon icon={amenity.icon} size={iconSize} className="text-[#767676] flex-shrink-0" />
      <span className={textClass}>{amenity.name}</span>
    </div>
  )
}
