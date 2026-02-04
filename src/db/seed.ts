import { db } from './index'
import { hosts, listings, listingPhotos, amenities, listingAmenities, reviews } from './schema'

// Clear existing data
db.delete(reviews).run()
db.delete(listingAmenities).run()
db.delete(listingPhotos).run()
db.delete(listings).run()
db.delete(amenities).run()
db.delete(hosts).run()

// Seed hosts
const hostData = [
  {
    name: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/host1/200',
    isSuperhost: true,
    joinDate: 'March 2015',
    responseRate: 100,
    responseTime: 'within an hour',
  },
  {
    name: 'Michael Chen',
    avatarUrl: 'https://picsum.photos/seed/host2/200',
    isSuperhost: true,
    joinDate: 'January 2018',
    responseRate: 98,
    responseTime: 'within a few hours',
  },
]

for (const host of hostData) {
  db.insert(hosts).values(host).run()
}

// Seed amenities
const amenityData = [
  { name: 'Wifi', icon: 'wifi' },
  { name: 'Kitchen', icon: 'kitchen' },
  { name: 'Free parking', icon: 'parking' },
  { name: 'Pool', icon: 'pool' },
  { name: 'Hot tub', icon: 'hot-tub' },
  { name: 'Air conditioning', icon: 'ac' },
  { name: 'Heating', icon: 'heating' },
  { name: 'Washer', icon: 'washer' },
  { name: 'Dryer', icon: 'dryer' },
  { name: 'TV', icon: 'tv' },
  { name: 'Gym', icon: 'gym' },
  { name: 'Breakfast', icon: 'breakfast' },
  { name: 'Indoor fireplace', icon: 'fireplace' },
  { name: 'Workspace', icon: 'workspace' },
  { name: 'Ocean view', icon: 'ocean' },
]

for (const amenity of amenityData) {
  db.insert(amenities).values(amenity).run()
}

// Seed listings
const listingData = [
  {
    title: 'Luxurious Beachfront Villa with Stunning Ocean Views',
    description: `Welcome to paradise! This stunning beachfront villa offers the ultimate escape with panoramic ocean views from every room. Wake up to the sound of waves and enjoy your morning coffee on the spacious terrace overlooking the crystal-clear waters.

The villa features an open-concept living area with floor-to-ceiling windows, a fully equipped gourmet kitchen, and a private infinity pool that seems to merge with the ocean horizon. The master suite includes a spa-like bathroom with a soaking tub and rain shower.

Perfect for families or groups, the property includes a private beach access path, outdoor dining area with BBQ, and a games room. Located just 10 minutes from downtown, you'll have easy access to restaurants, shops, and local attractions while enjoying complete privacy and serenity.

Additional amenities include high-speed WiFi, smart home features, daily housekeeping, and a dedicated concierge service to help you plan excursions and activities.`,
    propertyType: 'Entire villa',
    location: 'Malibu, California',
    pricePerNight: 450,
    cleaningFee: 150,
    serviceFee: 89,
    guests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3,
    hostId: 1,
    avgRating: 4.92,
    reviewCount: 127,
  },
  {
    title: 'Modern Downtown Loft with City Skyline Views',
    description: `Experience urban living at its finest in this beautifully designed modern loft in the heart of downtown. Floor-to-ceiling windows showcase breathtaking city skyline views, while the industrial-chic interior creates a sophisticated yet cozy atmosphere.

The open floor plan features a spacious living area, a designer kitchen with premium appliances, and a comfortable bedroom area with a king-sized bed. The bathroom includes a walk-in rain shower and luxury toiletries.

Located in a historic converted warehouse, the building offers secure parking, a rooftop terrace, and a 24-hour concierge. You'll be within walking distance of top restaurants, galleries, theaters, and public transit.

Whether you're here for business or pleasure, this loft provides the perfect base for exploring the city while enjoying the comforts of home.`,
    propertyType: 'Entire loft',
    location: 'San Francisco, California',
    pricePerNight: 225,
    cleaningFee: 75,
    serviceFee: 45,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    hostId: 2,
    avgRating: 4.88,
    reviewCount: 89,
  },
]

for (const listing of listingData) {
  db.insert(listings).values(listing).run()
}

// Seed listing photos
const photoData = [
  // Listing 1 photos
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-1/1200/800', order: 1 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-2/800/600', order: 2 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-3/800/600', order: 3 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-4/800/600', order: 4 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-5/800/600', order: 5 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-6/800/600', order: 6 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-7/800/600', order: 7 },
  { listingId: 1, url: 'https://picsum.photos/seed/listing1-8/800/600', order: 8 },
  // Listing 2 photos
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-1/1200/800', order: 1 },
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-2/800/600', order: 2 },
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-3/800/600', order: 3 },
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-4/800/600', order: 4 },
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-5/800/600', order: 5 },
  { listingId: 2, url: 'https://picsum.photos/seed/listing2-6/800/600', order: 6 },
]

for (const photo of photoData) {
  db.insert(listingPhotos).values(photo).run()
}

// Seed listing amenities (assign amenities to listings)
const listingAmenityData = [
  // Listing 1 amenities
  { listingId: 1, amenityId: 1 }, // Wifi
  { listingId: 1, amenityId: 2 }, // Kitchen
  { listingId: 1, amenityId: 3 }, // Free parking
  { listingId: 1, amenityId: 4 }, // Pool
  { listingId: 1, amenityId: 5 }, // Hot tub
  { listingId: 1, amenityId: 6 }, // AC
  { listingId: 1, amenityId: 7 }, // Heating
  { listingId: 1, amenityId: 8 }, // Washer
  { listingId: 1, amenityId: 9 }, // Dryer
  { listingId: 1, amenityId: 10 }, // TV
  { listingId: 1, amenityId: 13 }, // Fireplace
  { listingId: 1, amenityId: 15 }, // Ocean view
  // Listing 2 amenities
  { listingId: 2, amenityId: 1 }, // Wifi
  { listingId: 2, amenityId: 2 }, // Kitchen
  { listingId: 2, amenityId: 6 }, // AC
  { listingId: 2, amenityId: 7 }, // Heating
  { listingId: 2, amenityId: 8 }, // Washer
  { listingId: 2, amenityId: 10 }, // TV
  { listingId: 2, amenityId: 11 }, // Gym
  { listingId: 2, amenityId: 14 }, // Workspace
]

for (const la of listingAmenityData) {
  db.insert(listingAmenities).values(la).run()
}

// Seed reviews
const reviewData = [
  // Listing 1 reviews
  {
    listingId: 1,
    authorName: 'Emily Rodriguez',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer1/100',
    date: 'January 2024',
    text: 'Absolutely stunning property! The ocean views were even better than the photos. Sarah was an incredible host - she had everything perfectly prepared and even left us a welcome basket with local treats. The infinity pool was our favorite spot, and we spent every evening watching the sunset from the terrace. Cannot wait to come back!',
    rating: 5.0,
    cleanliness: 5.0,
    accuracy: 5.0,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.8,
  },
  {
    listingId: 1,
    authorName: 'James Wilson',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer2/100',
    date: 'December 2023',
    text: 'We stayed here for a family reunion and it was perfect. Plenty of space for everyone, the kitchen was well-equipped for cooking large meals, and the beach access made it easy to entertain the kids. The only minor issue was the WiFi being a bit slow during peak hours, but honestly we didn\'t spend much time online with views like that!',
    rating: 4.8,
    cleanliness: 5.0,
    accuracy: 4.8,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.5,
  },
  {
    listingId: 1,
    authorName: 'Sophie Martinez',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer3/100',
    date: 'November 2023',
    text: 'Dream vacation spot! Everything was immaculate and the attention to detail was impressive. The concierge helped us book a private boat tour that was the highlight of our trip. Highly recommend!',
    rating: 5.0,
    cleanliness: 5.0,
    accuracy: 5.0,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.9,
  },
  {
    listingId: 1,
    authorName: 'David Kim',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer4/100',
    date: 'October 2023',
    text: 'Great property with amazing views. The master bedroom is spectacular and waking up to the ocean every morning was surreal. Would definitely stay again.',
    rating: 4.9,
    cleanliness: 5.0,
    accuracy: 4.9,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.7,
  },
  // Listing 2 reviews
  {
    listingId: 2,
    authorName: 'Rachel Thompson',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer5/100',
    date: 'January 2024',
    text: 'Perfect location for exploring the city! The loft is beautifully designed and the bed was super comfortable. Michael provided excellent restaurant recommendations that led us to some hidden gems. The rooftop terrace was a nice bonus for morning coffee.',
    rating: 4.9,
    cleanliness: 5.0,
    accuracy: 5.0,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.8,
  },
  {
    listingId: 2,
    authorName: 'Alex Patel',
    authorAvatarUrl: 'https://picsum.photos/seed/reviewer6/100',
    date: 'December 2023',
    text: 'Stayed here for a work trip and it exceeded expectations. Fast WiFi, comfortable workspace, and an incredible view of the skyline at night. Will definitely book again for my next visit.',
    rating: 4.8,
    cleanliness: 4.9,
    accuracy: 4.8,
    checkIn: 5.0,
    communication: 5.0,
    location: 5.0,
    value: 4.7,
  },
]

for (const review of reviewData) {
  db.insert(reviews).values(review).run()
}

console.log('Database seeded successfully!')
