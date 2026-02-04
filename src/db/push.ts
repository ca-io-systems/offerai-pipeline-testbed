import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

sqlite.run(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    image TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    check_in_instructions TEXT,
    house_rules TEXT,
    latitude REAL,
    longitude REAL,
    cancellation_policy TEXT NOT NULL DEFAULT 'moderate',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

sqlite.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    cancellation_reason TEXT,
    cancellation_date TEXT,
    refund_amount REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

sqlite.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    guest_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

console.log('Database schema pushed successfully!')
