import {
  Wifi, ChefHat, Wind, Snowflake, Flame, Tv, Shirt, Monitor, Coffee,
  Waves, Bath, Dumbbell, Circle, Umbrella, Zap, Car, Thermometer, Gamepad2,
  AlertCircle, AlertTriangle, Cross, Lock, Camera, ShieldCheck, KeyRound,
  Armchair, Building2, Flower2, TreePine, Mountain, UtensilsCrossed, Sofa,
  Bike, Bed, DoorOpen, ShowerHead, Piano, Refrigerator,
  type LucideProps
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Wifi,
  ChefHat,
  WashingMachine: Wind,
  Wind,
  Snowflake,
  Flame,
  Tv,
  Shirt,
  Monitor,
  Coffee,
  Refrigerator,
  Waves,
  Bath,
  Dumbbell,
  Circle,
  Umbrella,
  Zap,
  Car,
  Thermometer,
  Gamepad2,
  AlertCircle,
  AlertTriangle,
  FireExtinguisher: Flame,
  Cross,
  Lock,
  Camera,
  ShieldCheck,
  KeyRound,
  Armchair,
  Building2,
  Flower2,
  TreePine,
  Mountain,
  UtensilsCrossed,
  Sofa,
  Bike,
  Bed,
  DoorOpen,
  ShowerHead,
  Piano,
}

type AmenityIconProps = {
  icon: string
  className?: string
  size?: number
}

export function AmenityIcon({ icon, className = '', size = 20 }: AmenityIconProps) {
  const IconComponent = iconMap[icon] || Circle
  return <IconComponent className={className} size={size} />
}
