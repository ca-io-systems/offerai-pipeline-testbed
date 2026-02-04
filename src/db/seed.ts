import { db } from './index'
import { users, listings, wishlists, wishlistItems } from './schema'

const userIds = ['user-1', 'user-2', 'user-3']
const listingIds = ['listing-1', 'listing-2', 'listing-3', 'listing-4', 'listing-5', 'listing-6']
const wishlistIds = ['wishlist-1', 'wishlist-2']

async function seed() {
  // Clear existing data
  await db.delete(wishlistItems)
  await db.delete(wishlists)
  await db.delete(listings)
  await db.delete(users)

  // Create users
  await db.insert(users).values([
    { id: userIds[0], email: 'alice@example.com', name: 'Alice Johnson', image: 'https://picsum.photos/seed/user1/200' },
    { id: userIds[1], email: 'bob@example.com', name: 'Bob Smith', image: 'https://picsum.photos/seed/user2/200' },
    { id: userIds[2], email: 'carol@example.com', name: 'Carol Davis', image: 'https://picsum.photos/seed/user3/200' },
  ])

  // Create listings
  await db.insert(listings).values([
    { id: listingIds[0], title: 'Cozy Beach House', description: 'A beautiful beach house with ocean views', price: 150, location: 'Malibu, CA', imageUrl: 'https://picsum.photos/seed/listing1/800/600', hostId: userIds[0] },
    { id: listingIds[1], title: 'Modern Downtown Loft', description: 'Stylish loft in the heart of the city', price: 200, location: 'New York, NY', imageUrl: 'https://picsum.photos/seed/listing2/800/600', hostId: userIds[0] },
    { id: listingIds[2], title: 'Mountain Cabin Retreat', description: 'Rustic cabin surrounded by nature', price: 120, location: 'Aspen, CO', imageUrl: 'https://picsum.photos/seed/listing3/800/600', hostId: userIds[1] },
    { id: listingIds[3], title: 'Lakefront Villa', description: 'Luxury villa with private lake access', price: 350, location: 'Lake Tahoe, CA', imageUrl: 'https://picsum.photos/seed/listing4/800/600', hostId: userIds[1] },
    { id: listingIds[4], title: 'Historic Townhouse', description: 'Charming townhouse with original features', price: 180, location: 'Boston, MA', imageUrl: 'https://picsum.photos/seed/listing5/800/600', hostId: userIds[2] },
    { id: listingIds[5], title: 'Desert Oasis', description: 'Peaceful retreat in the desert', price: 160, location: 'Scottsdale, AZ', imageUrl: 'https://picsum.photos/seed/listing6/800/600', hostId: userIds[2] },
  ])

  // Create wishlists
  await db.insert(wishlists).values([
    { id: wishlistIds[0], name: 'Summer Vacation', userId: userIds[0], isPublic: false, shareToken: 'abc123' },
    { id: wishlistIds[1], name: 'Weekend Getaways', userId: userIds[0], isPublic: true, shareToken: 'def456' },
  ])

  // Add items to wishlists
  await db.insert(wishlistItems).values([
    { wishlistId: wishlistIds[0], listingId: listingIds[0] },
    { wishlistId: wishlistIds[0], listingId: listingIds[1] },
    { wishlistId: wishlistIds[0], listingId: listingIds[3] },
    { wishlistId: wishlistIds[1], listingId: listingIds[2] },
    { wishlistId: wishlistIds[1], listingId: listingIds[4] },
  ])

  console.log('Database seeded successfully!')
}

seed().catch(console.error)
