import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

const cities = [
  { city: "New York", state: "NY", lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
];

const propertyTypes = ["Apartment", "House", "Condo", "Townhouse", "Villa", "Cabin", "Loft"];
const roomTypes = ["Entire place", "Private room", "Shared room"];

const listingTitles = [
  "Cozy Downtown Studio with City Views",
  "Modern Loft in the Heart of the City",
  "Charming Historic Brownstone",
  "Luxury Penthouse with Rooftop Access",
  "Peaceful Retreat with Garden",
  "Stylish Urban Apartment",
  "Spacious Family Home Near Park",
  "Artsy Bohemian Flat",
  "Executive Suite with Pool Access",
  "Beachside Bungalow Paradise",
  "Mountain View Cabin Escape",
  "Trendy Industrial Loft",
  "Romantic Getaway Suite",
  "Pet-Friendly Home with Backyard",
  "Minimalist Designer Apartment",
  "Waterfront Condo with Balcony",
  "Rustic Countryside Retreat",
  "Chic Boutique Studio",
  "Modern Smart Home",
  "Victorian Gem with Character",
  "Sunny Corner Apartment",
  "Eco-Friendly Green Living Space",
  "Artist's Dream Studio",
  "Quiet Neighborhood Haven",
  "Central Location Perfect for Explorers",
  "Elegant Suite Near Museums",
  "Contemporary Urban Oasis",
  "Family-Friendly Home with Amenities",
  "Sophisticated City Dwelling",
  "Unique Converted Warehouse Space",
];

const listingDescriptions = [
  "Welcome to our beautiful space! This thoughtfully designed property offers everything you need for a comfortable stay. Enjoy modern amenities, a fully equipped kitchen, and a prime location close to local attractions. Whether you're traveling for business or pleasure, you'll feel right at home here.",
  "Experience the best of city living in this stunning property. Recently renovated with high-end finishes, this space features an open floor plan, natural light throughout, and all the comforts of home. Walking distance to restaurants, shops, and entertainment.",
  "Escape the ordinary in this unique retreat. Perfect for couples or solo travelers looking for a special experience. The space has been carefully curated with comfort and style in mind. You'll love the neighborhood and easy access to public transit.",
  "This spacious property is ideal for families or groups. Featuring multiple bedrooms, a large living area, and a fully stocked kitchen, everyone will have room to spread out. The location offers a perfect blend of quiet residential living and urban convenience.",
  "Step into luxury at this premium property. Every detail has been considered to ensure your stay is exceptional. From premium linens to state-of-the-art appliances, no expense has been spared. Treat yourself to an unforgettable experience.",
];

const amenitiesList = [
  { name: "WiFi", icon: "wifi", category: "essentials" },
  { name: "Kitchen", icon: "utensils", category: "essentials" },
  { name: "Pool", icon: "pool", category: "outdoor" },
  { name: "Free Parking", icon: "car", category: "parking" },
  { name: "Air Conditioning", icon: "snowflake", category: "essentials" },
  { name: "Heating", icon: "fire", category: "essentials" },
  { name: "Washer", icon: "washing-machine", category: "essentials" },
  { name: "Dryer", icon: "wind", category: "essentials" },
  { name: "TV", icon: "tv", category: "entertainment" },
  { name: "Gym", icon: "dumbbell", category: "fitness" },
  { name: "Hot Tub", icon: "hot-tub", category: "outdoor" },
  { name: "Fireplace", icon: "fireplace", category: "heating" },
  { name: "BBQ Grill", icon: "grill", category: "outdoor" },
  { name: "Patio", icon: "sun", category: "outdoor" },
  { name: "Beach Access", icon: "umbrella-beach", category: "outdoor" },
  { name: "Balcony", icon: "door-open", category: "outdoor" },
  { name: "Coffee Maker", icon: "coffee", category: "kitchen" },
  { name: "Dishwasher", icon: "sink", category: "kitchen" },
  { name: "Pet Friendly", icon: "paw", category: "policies" },
  { name: "Smoke Alarm", icon: "bell", category: "safety" },
];

const categoriesList = [
  { name: "Beachfront", icon: "beach", slug: "beachfront" },
  { name: "Cabins", icon: "cabin", slug: "cabins" },
  { name: "Trending", icon: "fire", slug: "trending" },
  { name: "Amazing pools", icon: "pool", slug: "amazing-pools" },
  { name: "Countryside", icon: "tree", slug: "countryside" },
];

const reviewTexts = [
  "Had an amazing stay! The place was exactly as described and the host was super responsive. Would definitely come back!",
  "Perfect location for exploring the city. Clean, comfortable, and had everything we needed. Highly recommend!",
  "Great value for the price. The apartment was cozy and well-maintained. The neighborhood had great restaurants nearby.",
  "Wonderful experience from start to finish. Check-in was smooth and the amenities were top-notch. Thank you!",
  "The photos don't do this place justice - it's even better in person! Such a lovely space with thoughtful touches.",
  "Exactly what we were looking for. Quiet neighborhood, comfortable bed, and a great kitchen for cooking meals.",
  "Host was incredibly helpful with local recommendations. The place was spotless and had great views. A+ experience!",
  "Stayed here for a week and felt right at home. Everything was well-organized and the communication was excellent.",
  "Beautiful space with lots of natural light. Very clean and modern. Would stay here again without hesitation.",
  "A gem of a find! The location is perfect and the space is thoughtfully designed. Exceeded our expectations.",
];

const messageTexts = [
  "Hi! I'm interested in booking your place for next weekend. Is it available?",
  "Thanks for reaching out! Yes, it's available. How many guests will be staying?",
  "Great! It will be just 2 of us. What's the check-in process like?",
  "Perfect! I offer self check-in with a smart lock. I'll send you the code on the day of your arrival.",
  "That sounds convenient. Is there parking available nearby?",
  "Yes, there's free street parking and also a paid garage one block away.",
  "Wonderful, thank you for all the info! Looking forward to our stay.",
  "You're welcome! Let me know if you have any other questions.",
  "Quick question - is the apartment close to public transportation?",
  "Yes, the subway station is just a 5-minute walk away.",
  "Hi there! We just arrived. The place looks amazing!",
  "So glad to hear that! Enjoy your stay and don't hesitate to reach out if you need anything.",
  "Would it be possible to get a late checkout on Sunday?",
  "I can offer checkout until 1pm if that works for you.",
  "That would be perfect, thank you so much!",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  console.log("🌱 Starting seed...");

  // Clear existing data in reverse dependency order
  console.log("Clearing existing data...");
  db.delete(schema.notifications).run();
  db.delete(schema.wishlistItems).run();
  db.delete(schema.wishlists).run();
  db.delete(schema.messages).run();
  db.delete(schema.reviewResponses).run();
  db.delete(schema.reviews).run();
  db.delete(schema.bookings).run();
  db.delete(schema.listingCategories).run();
  db.delete(schema.listingAmenities).run();
  db.delete(schema.listingImages).run();
  db.delete(schema.categories).run();
  db.delete(schema.amenities).run();
  db.delete(schema.listings).run();
  db.delete(schema.users).run();

  // Create 10 users
  console.log("Creating users...");
  const userNames = [
    "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim",
    "Jessica Taylor", "Christopher Brown", "Amanda Martinez", "Daniel Wilson",
    "Rachel Lee", "James Anderson"
  ];
  
  const createdUsers: number[] = [];
  for (let i = 0; i < 10; i++) {
    const result = db.insert(schema.users).values({
      email: `user${i + 1}@example.com`,
      passwordHash: `$2b$10$hashedpassword${i + 1}`,
      name: userNames[i],
      avatarUrl: `https://picsum.photos/200/200?random=${i + 100}`,
      bio: `Hi, I'm ${userNames[i].split(" ")[0]}! I love traveling and meeting new people.`,
      phone: `+1-555-${String(100 + i).padStart(3, "0")}-${String(1000 + i * 111).slice(0, 4)}`,
    }).returning().get();
    createdUsers.push(result.id);
  }

  // Create 20 amenities
  console.log("Creating amenities...");
  const createdAmenities: number[] = [];
  for (const amenity of amenitiesList) {
    const result = db.insert(schema.amenities).values(amenity).returning().get();
    createdAmenities.push(result.id);
  }

  // Create 5 categories
  console.log("Creating categories...");
  const createdCategories: number[] = [];
  for (const category of categoriesList) {
    const result = db.insert(schema.categories).values(category).returning().get();
    createdCategories.push(result.id);
  }

  // Create 30 listings (5 per city)
  console.log("Creating listings...");
  const createdListings: Array<{ id: number; hostId: number }> = [];
  let imageCounter = 1;
  
  for (let i = 0; i < 30; i++) {
    const cityInfo = cities[i % cities.length];
    const hostId = createdUsers[i % createdUsers.length];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const result = db.insert(schema.listings).values({
      hostId,
      title: listingTitles[i],
      description: listingDescriptions[i % listingDescriptions.length],
      propertyType: randomElement(propertyTypes),
      roomType: randomElement(roomTypes),
      maxGuests: randomInt(1, 8),
      bedrooms: randomInt(1, 4),
      beds: randomInt(1, 6),
      bathrooms: randomInt(1, 3),
      pricePerNight: randomInt(50, 500),
      cleaningFee: randomInt(20, 100),
      serviceFee: randomInt(10, 50),
      latitude: cityInfo.lat + latOffset,
      longitude: cityInfo.lng + lngOffset,
      city: cityInfo.city,
      state: cityInfo.state,
      country: "United States",
      address: `${randomInt(100, 9999)} ${randomElement(["Main", "Oak", "Maple", "Cedar", "Pine", "Broadway", "Park"])} ${randomElement(["St", "Ave", "Blvd", "Rd", "Way"])}`,
      isPublished: true,
    }).returning().get();
    
    createdListings.push({ id: result.id, hostId });

    // Add 5 images per listing
    for (let j = 0; j < 5; j++) {
      db.insert(schema.listingImages).values({
        listingId: result.id,
        url: `https://picsum.photos/800/600?random=${imageCounter++}`,
        caption: j === 0 ? "Main photo" : `Photo ${j + 1}`,
        order: j,
      }).run();
    }

    // Add random amenities to listing (5-12 amenities per listing)
    const amenityCount = randomInt(5, 12);
    const shuffledAmenities = [...createdAmenities].sort(() => Math.random() - 0.5);
    for (let j = 0; j < amenityCount; j++) {
      db.insert(schema.listingAmenities).values({
        listingId: result.id,
        amenityId: shuffledAmenities[j],
      }).run();
    }

    // Add 1-2 categories per listing
    const categoryCount = randomInt(1, 2);
    const shuffledCategories = [...createdCategories].sort(() => Math.random() - 0.5);
    for (let j = 0; j < categoryCount; j++) {
      db.insert(schema.listingCategories).values({
        listingId: result.id,
        categoryId: shuffledCategories[j],
      }).run();
    }
  }

  // Create 50 bookings
  console.log("Creating bookings...");
  const createdBookings: Array<{ id: number; guestId: number; listingId: number; hostId: number }> = [];
  const statuses = ["confirmed", "completed", "cancelled", "pending"];
  
  for (let i = 0; i < 50; i++) {
    const listing = randomElement(createdListings);
    // Ensure guest is not the host
    const availableGuests = createdUsers.filter(u => u !== listing.hostId);
    const guestId = randomElement(availableGuests);
    
    const checkIn = randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31));
    const nights = randomInt(2, 14);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);
    
    const result = db.insert(schema.bookings).values({
      guestId,
      listingId: listing.id,
      checkIn,
      checkOut,
      totalPrice: randomInt(200, 5000),
      status: randomElement(statuses),
      guestsCount: randomInt(1, 4),
    }).returning().get();
    
    createdBookings.push({ id: result.id, guestId, listingId: listing.id, hostId: listing.hostId });
  }

  // Create 30 reviews
  console.log("Creating reviews...");
  const completedBookings = createdBookings.filter((_, i) => i < 35);
  const createdReviews: Array<{ id: number; listingId: number; hostId: number }> = [];
  
  for (let i = 0; i < 30; i++) {
    const booking = completedBookings[i % completedBookings.length];
    const rating = randomInt(3, 5);
    
    const result = db.insert(schema.reviews).values({
      bookingId: booking.id,
      authorId: booking.guestId,
      listingId: booking.listingId,
      rating,
      cleanliness: randomInt(3, 5),
      accuracy: randomInt(3, 5),
      checkIn: randomInt(3, 5),
      communication: randomInt(4, 5),
      location: randomInt(3, 5),
      value: randomInt(3, 5),
      text: randomElement(reviewTexts),
    }).returning().get();
    
    createdReviews.push({ id: result.id, listingId: booking.listingId, hostId: booking.hostId });
  }

  // Create some review responses (for about half of the reviews)
  console.log("Creating review responses...");
  for (let i = 0; i < 15; i++) {
    const review = createdReviews[i];
    db.insert(schema.reviewResponses).values({
      reviewId: review.id,
      hostId: review.hostId,
      text: randomElement([
        "Thank you so much for your kind review! We're glad you enjoyed your stay.",
        "We appreciate your feedback! Hope to host you again soon.",
        "Thanks for being such a wonderful guest! Looking forward to your next visit.",
        "So happy you had a great experience! Your review means a lot to us.",
      ]),
    }).run();
  }

  // Create 15 messages
  console.log("Creating messages...");
  for (let i = 0; i < 15; i++) {
    const listing = randomElement(createdListings);
    const availableUsers = createdUsers.filter(u => u !== listing.hostId);
    const guestId = randomElement(availableUsers);
    
    const isFromGuest = i % 2 === 0;
    db.insert(schema.messages).values({
      senderId: isFromGuest ? guestId : listing.hostId,
      receiverId: isFromGuest ? listing.hostId : guestId,
      listingId: listing.id,
      text: messageTexts[i],
      isRead: i < 10,
    }).run();
  }

  // Create some wishlists
  console.log("Creating wishlists...");
  for (let i = 0; i < 5; i++) {
    const result = db.insert(schema.wishlists).values({
      userId: createdUsers[i],
      name: randomElement(["Dream Vacations", "Summer 2025", "Weekend Getaways", "Beach Trips", "City Escapes"]),
    }).returning().get();
    
    // Add 2-4 listings to each wishlist
    const itemCount = randomInt(2, 4);
    const shuffledListings = [...createdListings].sort(() => Math.random() - 0.5);
    for (let j = 0; j < itemCount; j++) {
      db.insert(schema.wishlistItems).values({
        wishlistId: result.id,
        listingId: shuffledListings[j].id,
      }).run();
    }
  }

  // Create some notifications
  console.log("Creating notifications...");
  const notificationTypes = ["booking_confirmed", "new_message", "review_received", "payment_received"];
  for (let i = 0; i < 20; i++) {
    const type = randomElement(notificationTypes);
    const userId = randomElement(createdUsers);
    
    db.insert(schema.notifications).values({
      userId,
      type,
      title: {
        booking_confirmed: "Booking Confirmed!",
        new_message: "New Message",
        review_received: "New Review",
        payment_received: "Payment Received",
      }[type]!,
      body: {
        booking_confirmed: "Your booking has been confirmed. Get ready for your trip!",
        new_message: "You have a new message from a guest.",
        review_received: "A guest left you a review. Check it out!",
        payment_received: "Your payout has been processed successfully.",
      }[type]!,
      isRead: i < 10,
      relatedId: i % 2 === 0 ? randomInt(1, 10) : null,
    }).run();
  }

  console.log("✅ Seed completed successfully!");
  console.log("Summary:");
  console.log("- 10 users");
  console.log("- 30 listings (5 per city: NYC, LA, Miami, Austin, Denver, Seattle)");
  console.log("- 150 listing images (5 per listing)");
  console.log("- 20 amenities");
  console.log("- 5 categories");
  console.log("- 50 bookings");
  console.log("- 30 reviews");
  console.log("- 15 review responses");
  console.log("- 15 messages");
  console.log("- 5 wishlists with items");
  console.log("- 20 notifications");
}

seed().catch(console.error);
