import { Database } from 'bun:sqlite'

const db = new Database('sqlite.db')

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    host_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    price_per_night INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    listing_id TEXT NOT NULL REFERENCES listings(id),
    guest_id TEXT NOT NULL REFERENCES users(id),
    host_id TEXT NOT NULL REFERENCES users(id),
    check_in INTEGER NOT NULL,
    check_out INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL REFERENCES bookings(id),
    author_id TEXT NOT NULL REFERENCES users(id),
    recipient_id TEXT NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id),
    recipient_id TEXT NOT NULL REFERENCES users(id),
    booking_id TEXT REFERENCES bookings(id),
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK(type IN ('booking_confirmed', 'booking_request', 'booking_cancelled', 'review_received', 'message_received', 'listing_published', 'price_change')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link_url TEXT,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS notification_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
    booking_confirmed_in_app INTEGER NOT NULL DEFAULT 1,
    booking_confirmed_email INTEGER NOT NULL DEFAULT 1,
    booking_request_in_app INTEGER NOT NULL DEFAULT 1,
    booking_request_email INTEGER NOT NULL DEFAULT 1,
    booking_cancelled_in_app INTEGER NOT NULL DEFAULT 1,
    booking_cancelled_email INTEGER NOT NULL DEFAULT 1,
    review_received_in_app INTEGER NOT NULL DEFAULT 1,
    review_received_email INTEGER NOT NULL DEFAULT 1,
    message_received_in_app INTEGER NOT NULL DEFAULT 1,
    message_received_email INTEGER NOT NULL DEFAULT 1,
    listing_published_in_app INTEGER NOT NULL DEFAULT 1,
    listing_published_email INTEGER NOT NULL DEFAULT 1,
    price_change_in_app INTEGER NOT NULL DEFAULT 1,
    price_change_email INTEGER NOT NULL DEFAULT 1
  )
`)

console.log('Database schema pushed successfully!')
