import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    price_per_night INTEGER NOT NULL,
    image_url TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    guest_id INTEGER NOT NULL REFERENCES users(id),
    check_in INTEGER NOT NULL,
    check_out INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    guest_id INTEGER NOT NULL REFERENCES users(id),
    overall_rating INTEGER NOT NULL CHECK(overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER NOT NULL CHECK(cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    accuracy_rating INTEGER NOT NULL CHECK(accuracy_rating >= 1 AND accuracy_rating <= 5),
    checkin_rating INTEGER NOT NULL CHECK(checkin_rating >= 1 AND checkin_rating <= 5),
    communication_rating INTEGER NOT NULL CHECK(communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER NOT NULL CHECK(location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER NOT NULL CHECK(value_rating >= 1 AND value_rating <= 5),
    review_text TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );

  CREATE TABLE IF NOT EXISTS host_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL UNIQUE REFERENCES reviews(id),
    host_id INTEGER NOT NULL REFERENCES users(id),
    response_text TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  );
`)

console.log('Database schema pushed successfully!')
