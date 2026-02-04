import {
  Mountain, Umbrella, Home, TreePine, Gem, Tractor, Palmtree, Waves,
  Castle, Trees, Sparkles, Sun, Wine, type LucideProps
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Mountain,
  Umbrella,
  Home,
  TreePine,
  Gem,
  Tractor,
  Palmtree,
  Waves,
  Castle,
  Trees,
  Sparkles,
  Sun,
  Wine,
}

type CategoryIconProps = {
  icon: string
  className?: string
  size?: number
}

export function CategoryIcon({ icon, className = '', size = 24 }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || Home
  return <IconComponent className={className} size={size} />
}
