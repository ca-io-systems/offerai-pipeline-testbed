export const amenityCategoriesData = [
  { name: 'Essentials', slug: 'essentials' },
  { name: 'Features', slug: 'features' },
  { name: 'Safety', slug: 'safety' },
  { name: 'Outdoor', slug: 'outdoor' },
] as const

export const amenitiesData = [
  // Essentials (8)
  { name: 'WiFi', slug: 'wifi', icon: 'Wifi', categorySlug: 'essentials' },
  { name: 'Kitchen', slug: 'kitchen', icon: 'ChefHat', categorySlug: 'essentials' },
  { name: 'Washer', slug: 'washer', icon: 'WashingMachine', categorySlug: 'essentials' },
  { name: 'Dryer', slug: 'dryer', icon: 'Wind', categorySlug: 'essentials' },
  { name: 'Air conditioning', slug: 'ac', icon: 'Snowflake', categorySlug: 'essentials' },
  { name: 'Heating', slug: 'heating', icon: 'Flame', categorySlug: 'essentials' },
  { name: 'TV', slug: 'tv', icon: 'Tv', categorySlug: 'essentials' },
  { name: 'Hair dryer', slug: 'hair-dryer', icon: 'Wind', categorySlug: 'essentials' },
  { name: 'Iron', slug: 'iron', icon: 'Shirt', categorySlug: 'essentials' },
  { name: 'Workspace', slug: 'workspace', icon: 'Monitor', categorySlug: 'essentials' },
  { name: 'Coffee maker', slug: 'coffee-maker', icon: 'Coffee', categorySlug: 'essentials' },
  { name: 'Refrigerator', slug: 'refrigerator', icon: 'Refrigerator', categorySlug: 'essentials' },

  // Features (12)
  { name: 'Pool', slug: 'pool', icon: 'Waves', categorySlug: 'features' },
  { name: 'Hot tub', slug: 'hot-tub', icon: 'Bath', categorySlug: 'features' },
  { name: 'Gym', slug: 'gym', icon: 'Dumbbell', categorySlug: 'features' },
  { name: 'BBQ grill', slug: 'bbq-grill', icon: 'Flame', categorySlug: 'features' },
  { name: 'Fire pit', slug: 'fire-pit', icon: 'Flame', categorySlug: 'features' },
  { name: 'Piano', slug: 'piano', icon: 'Piano', categorySlug: 'features' },
  { name: 'Billiards', slug: 'billiards', icon: 'Circle', categorySlug: 'features' },
  { name: 'Beach access', slug: 'beach-access', icon: 'Umbrella', categorySlug: 'features' },
  { name: 'EV charger', slug: 'ev-charger', icon: 'Zap', categorySlug: 'features' },
  { name: 'Parking', slug: 'parking', icon: 'Car', categorySlug: 'features' },
  { name: 'Sauna', slug: 'sauna', icon: 'Thermometer', categorySlug: 'features' },
  { name: 'Game room', slug: 'game-room', icon: 'Gamepad2', categorySlug: 'features' },

  // Safety (8)
  { name: 'Smoke alarm', slug: 'smoke-alarm', icon: 'AlertCircle', categorySlug: 'safety' },
  { name: 'Carbon monoxide alarm', slug: 'co-alarm', icon: 'AlertTriangle', categorySlug: 'safety' },
  { name: 'Fire extinguisher', slug: 'fire-extinguisher', icon: 'FireExtinguisher', categorySlug: 'safety' },
  { name: 'First aid kit', slug: 'first-aid', icon: 'Cross', categorySlug: 'safety' },
  { name: 'Lock on bedroom door', slug: 'bedroom-lock', icon: 'Lock', categorySlug: 'safety' },
  { name: 'Security cameras', slug: 'security-cameras', icon: 'Camera', categorySlug: 'safety' },
  { name: 'Safe', slug: 'safe', icon: 'ShieldCheck', categorySlug: 'safety' },
  { name: 'Deadbolt lock', slug: 'deadbolt', icon: 'KeyRound', categorySlug: 'safety' },

  // Outdoor (12)
  { name: 'Patio', slug: 'patio', icon: 'Armchair', categorySlug: 'outdoor' },
  { name: 'Balcony', slug: 'balcony', icon: 'Building2', categorySlug: 'outdoor' },
  { name: 'Garden', slug: 'garden', icon: 'Flower2', categorySlug: 'outdoor' },
  { name: 'Backyard', slug: 'backyard', icon: 'TreePine', categorySlug: 'outdoor' },
  { name: 'Lake access', slug: 'lake-access', icon: 'Waves', categorySlug: 'outdoor' },
  { name: 'Ski-in/Ski-out', slug: 'ski-in-out', icon: 'Mountain', categorySlug: 'outdoor' },
  { name: 'Outdoor dining', slug: 'outdoor-dining', icon: 'UtensilsCrossed', categorySlug: 'outdoor' },
  { name: 'Outdoor furniture', slug: 'outdoor-furniture', icon: 'Sofa', categorySlug: 'outdoor' },
  { name: 'Bike storage', slug: 'bike-storage', icon: 'Bike', categorySlug: 'outdoor' },
  { name: 'Hammock', slug: 'hammock', icon: 'Bed', categorySlug: 'outdoor' },
  { name: 'Private entrance', slug: 'private-entrance', icon: 'DoorOpen', categorySlug: 'outdoor' },
  { name: 'Outdoor shower', slug: 'outdoor-shower', icon: 'ShowerHead', categorySlug: 'outdoor' },
] as const

export const categoriesData = [
  { name: 'Amazing views', slug: 'amazing-views', description: 'Properties with breathtaking scenery', icon: 'Mountain' },
  { name: 'Beach', slug: 'beach', description: 'Properties near the beach', icon: 'Umbrella' },
  { name: 'Cabins', slug: 'cabins', description: 'Cozy cabin retreats', icon: 'Home' },
  { name: 'Countryside', slug: 'countryside', description: 'Rural escapes', icon: 'TreePine' },
  { name: 'Design', slug: 'design', description: 'Architecturally unique spaces', icon: 'Gem' },
  { name: 'Farms', slug: 'farms', description: 'Farm stays and agritourism', icon: 'Tractor' },
  { name: 'Islands', slug: 'islands', description: 'Island getaways', icon: 'Palmtree' },
  { name: 'Lakefront', slug: 'lakefront', description: 'Properties on lakes', icon: 'Waves' },
  { name: 'Mansions', slug: 'mansions', description: 'Luxurious estates', icon: 'Castle' },
  { name: 'National parks', slug: 'national-parks', description: 'Near national parks', icon: 'Trees' },
  { name: 'OMG!', slug: 'omg', description: 'Unique and unexpected stays', icon: 'Sparkles' },
  { name: 'Pools', slug: 'pools', description: 'Properties with pools', icon: 'Waves' },
  { name: 'Skiing', slug: 'skiing', description: 'Ski-in/ski-out properties', icon: 'Mountain' },
  { name: 'Tiny homes', slug: 'tiny-homes', description: 'Compact living spaces', icon: 'Home' },
  { name: 'Treehouses', slug: 'treehouses', description: 'Elevated living', icon: 'TreePine' },
  { name: 'Tropical', slug: 'tropical', description: 'Tropical paradise', icon: 'Sun' },
  { name: 'Vineyards', slug: 'vineyards', description: 'Wine country stays', icon: 'Wine' },
] as const

export type AmenitySlug = typeof amenitiesData[number]['slug']
export type CategorySlug = typeof categoriesData[number]['slug']
