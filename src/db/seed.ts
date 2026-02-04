import { Database } from 'bun:sqlite'
import { amenityCategoriesData, amenitiesData, categoriesData } from '../lib/amenities-data'

const db = new Database('sqlite.db')

// Clear existing data
db.exec('DELETE FROM listing_amenities')
db.exec('DELETE FROM listings')
db.exec('DELETE FROM amenities')
db.exec('DELETE FROM amenity_categories')
db.exec('DELETE FROM categories')

// Seed amenity categories
const amenityCategoryIds: Record<string, number> = {}
for (const category of amenityCategoriesData) {
  const result = db.run(
    'INSERT INTO amenity_categories (name, slug) VALUES (?, ?)',
    [category.name, category.slug]
  )
  amenityCategoryIds[category.slug] = Number(result.lastInsertRowid)
}

// Seed amenities
const amenityIds: Record<string, number> = {}
for (const amenity of amenitiesData) {
  const categoryId = amenityCategoryIds[amenity.categorySlug]
  const result = db.run(
    'INSERT INTO amenities (name, slug, icon, category_id) VALUES (?, ?, ?, ?)',
    [amenity.name, amenity.slug, amenity.icon, categoryId]
  )
  amenityIds[amenity.slug] = Number(result.lastInsertRowid)
}

// Seed categories
const categoryIds: Record<string, number> = {}
for (const category of categoriesData) {
  const result = db.run(
    'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
    [category.name, category.slug, category.description, category.icon]
  )
  categoryIds[category.slug] = Number(result.lastInsertRowid)
}

// Amenity sets for different property types
const baseAmenities = ['wifi', 'tv', 'heating', 'smoke-alarm', 'co-alarm', 'first-aid']
const apartmentAmenities = [...baseAmenities, 'kitchen', 'washer', 'dryer', 'ac', 'workspace', 'coffee-maker', 'refrigerator', 'iron']
const beachAmenities = [...baseAmenities, 'beach-access', 'pool', 'ac', 'outdoor-shower', 'patio', 'outdoor-furniture', 'outdoor-dining']
const cabinAmenities = [...baseAmenities, 'kitchen', 'fire-pit', 'bbq-grill', 'backyard', 'patio', 'outdoor-furniture', 'coffee-maker']
const luxuryAmenities = [...apartmentAmenities, 'pool', 'hot-tub', 'gym', 'sauna', 'parking', 'ev-charger', 'safe', 'security-cameras']
const farmAmenities = [...baseAmenities, 'kitchen', 'garden', 'backyard', 'outdoor-dining', 'bike-storage', 'private-entrance']
const skiAmenities = [...baseAmenities, 'kitchen', 'ski-in-out', 'hot-tub', 'parking', 'workspace', 'coffee-maker']
const treehouseAmenities = [...baseAmenities, 'balcony', 'hammock', 'outdoor-furniture', 'private-entrance']
const lakefrontAmenities = [...baseAmenities, 'lake-access', 'kitchen', 'patio', 'outdoor-dining', 'outdoor-furniture', 'bbq-grill']

// Sample listings with realistic data
const listingsData = [
  { title: 'Modern Downtown Loft', description: 'Stylish loft in the heart of the city', pricePerNight: 150, location: 'New York, NY', categorySlug: 'design', amenities: apartmentAmenities, guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rating: 4.9, reviewCount: 127 },
  { title: 'Beachfront Paradise Villa', description: 'Wake up to ocean views every day', pricePerNight: 350, location: 'Malibu, CA', categorySlug: 'beach', amenities: beachAmenities, guests: 6, bedrooms: 3, beds: 3, bathrooms: 2, rating: 4.8, reviewCount: 89 },
  { title: 'Cozy Mountain Cabin', description: 'Rustic retreat in the mountains', pricePerNight: 180, location: 'Aspen, CO', categorySlug: 'cabins', amenities: cabinAmenities, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rating: 4.7, reviewCount: 156 },
  { title: 'Luxury Estate with Pool', description: 'Experience ultimate luxury', pricePerNight: 800, location: 'Beverly Hills, CA', categorySlug: 'mansions', amenities: luxuryAmenities, guests: 10, bedrooms: 5, beds: 6, bathrooms: 4, rating: 5.0, reviewCount: 42 },
  { title: 'Charming Farm Stay', description: 'Connect with nature on a working farm', pricePerNight: 120, location: 'Vermont, VT', categorySlug: 'farms', amenities: farmAmenities, guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rating: 4.6, reviewCount: 78 },
  { title: 'Ski Chalet with Hot Tub', description: 'Ski-in/ski-out access', pricePerNight: 400, location: 'Park City, UT', categorySlug: 'skiing', amenities: skiAmenities, guests: 8, bedrooms: 4, beds: 5, bathrooms: 3, rating: 4.9, reviewCount: 201 },
  { title: 'Magical Treehouse Retreat', description: 'Sleep among the trees', pricePerNight: 200, location: 'Asheville, NC', categorySlug: 'treehouses', amenities: treehouseAmenities, guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rating: 4.8, reviewCount: 312 },
  { title: 'Lakefront Cottage', description: 'Peaceful waterfront escape', pricePerNight: 220, location: 'Lake Tahoe, CA', categorySlug: 'lakefront', amenities: lakefrontAmenities, guests: 6, bedrooms: 3, beds: 3, bathrooms: 2, rating: 4.7, reviewCount: 98 },
  { title: 'Stunning Cliffside Home', description: 'Panoramic mountain views', pricePerNight: 280, location: 'Sedona, AZ', categorySlug: 'amazing-views', amenities: [...apartmentAmenities, 'balcony', 'outdoor-furniture'], guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rating: 4.9, reviewCount: 145 },
  { title: 'Private Island Bungalow', description: 'Your own slice of paradise', pricePerNight: 600, location: 'Florida Keys, FL', categorySlug: 'islands', amenities: [...beachAmenities, 'private-entrance', 'hammock'], guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rating: 4.8, reviewCount: 56 },
  { title: 'Countryside Manor', description: 'Rolling hills and fresh air', pricePerNight: 175, location: 'Napa Valley, CA', categorySlug: 'countryside', amenities: [...farmAmenities, 'pool'], guests: 6, bedrooms: 3, beds: 4, bathrooms: 2, rating: 4.6, reviewCount: 87 },
  { title: 'Geodesic Dome Experience', description: 'Unique architectural wonder', pricePerNight: 250, location: 'Joshua Tree, CA', categorySlug: 'omg', amenities: [...baseAmenities, 'ac', 'outdoor-furniture', 'outdoor-shower', 'private-entrance'], guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rating: 4.9, reviewCount: 234 },
  { title: 'Tiny Home in the Woods', description: 'Minimalist living at its finest', pricePerNight: 95, location: 'Portland, OR', categorySlug: 'tiny-homes', amenities: [...baseAmenities, 'kitchen', 'coffee-maker', 'private-entrance'], guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rating: 4.7, reviewCount: 189 },
  { title: 'Tropical Beachside Villa', description: 'Palm trees and ocean breeze', pricePerNight: 320, location: 'Maui, HI', categorySlug: 'tropical', amenities: [...beachAmenities, 'garden', 'hammock'], guests: 6, bedrooms: 3, beds: 3, bathrooms: 2, rating: 4.8, reviewCount: 167 },
  { title: 'Vineyard Guest House', description: 'Wine country escape', pricePerNight: 195, location: 'Sonoma, CA', categorySlug: 'vineyards', amenities: [...farmAmenities, 'patio', 'hot-tub'], guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rating: 4.6, reviewCount: 112 },
  { title: 'Infinity Pool Paradise', description: 'Stunning pool with views', pricePerNight: 450, location: 'Scottsdale, AZ', categorySlug: 'pools', amenities: [...luxuryAmenities, 'outdoor-dining', 'bbq-grill'], guests: 8, bedrooms: 4, beds: 4, bathrooms: 3, rating: 4.9, reviewCount: 76 },
  { title: 'National Park Gateway', description: 'Steps from wilderness', pricePerNight: 140, location: 'Moab, UT', categorySlug: 'national-parks', amenities: [...cabinAmenities, 'bike-storage'], guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rating: 4.5, reviewCount: 203 },
  { title: 'Designer Penthouse', description: 'Award-winning architecture', pricePerNight: 550, location: 'Miami, FL', categorySlug: 'design', amenities: [...luxuryAmenities, 'balcony'], guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rating: 4.9, reviewCount: 94 },
  { title: 'Oceanfront Beach House', description: 'Direct beach access', pricePerNight: 380, location: 'San Diego, CA', categorySlug: 'beach', amenities: [...beachAmenities, 'hot-tub', 'bbq-grill'], guests: 8, bedrooms: 4, beds: 5, bathrooms: 3, rating: 4.8, reviewCount: 178 },
  { title: 'Log Cabin Hideaway', description: 'Authentic log cabin experience', pricePerNight: 165, location: 'Big Bear, CA', categorySlug: 'cabins', amenities: [...cabinAmenities, 'hot-tub'], guests: 6, bedrooms: 2, beds: 3, bathrooms: 1, rating: 4.7, reviewCount: 134 },
]

// Seed listings and their amenities
for (let i = 0; i < listingsData.length; i++) {
  const listing = listingsData[i]
  const imageId = 100 + i
  const result = db.run(
    `INSERT INTO listings (title, description, price_per_night, location, image_url, category_id, guests, bedrooms, beds, bathrooms, rating, review_count) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      listing.title,
      listing.description,
      listing.pricePerNight,
      listing.location,
      `https://picsum.photos/seed/${imageId}/800/600`,
      categoryIds[listing.categorySlug],
      listing.guests,
      listing.bedrooms,
      listing.beds,
      listing.bathrooms,
      listing.rating,
      listing.reviewCount,
    ]
  )
  const listingId = Number(result.lastInsertRowid)

  // Add amenities for this listing
  const uniqueAmenities = [...new Set(listing.amenities)]
  for (const amenitySlug of uniqueAmenities) {
    const amenityId = amenityIds[amenitySlug]
    if (amenityId) {
      db.run(
        'INSERT INTO listing_amenities (listing_id, amenity_id) VALUES (?, ?)',
        [listingId, amenityId]
      )
    }
  }
}

console.log('Database seeded successfully!')
console.log(`- ${amenityCategoriesData.length} amenity categories`)
console.log(`- ${amenitiesData.length} amenities`)
console.log(`- ${categoriesData.length} categories`)
console.log(`- ${listingsData.length} listings`)
