import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    emergency_contact TEXT,
    email_verified INTEGER DEFAULT 0,
    phone_verified INTEGER DEFAULT 0,
    id_verified INTEGER DEFAULT 0,
    response_rate INTEGER DEFAULT 100,
    response_time TEXT DEFAULT 'within an hour',
    created_at INTEGER
  )
`)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    price_per_night INTEGER NOT NULL,
    rating REAL,
    review_count INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at INTEGER
  )
`)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    check_in INTEGER NOT NULL,
    check_out INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL,
    guests_count INTEGER NOT NULL,
    created_at INTEGER
  )
`)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    target_user_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER REFERENCES listings(id),
    rating INTEGER NOT NULL,
    text TEXT,
    type TEXT NOT NULL,
    created_at INTEGER
  )
`)

console.log('Database schema pushed successfully!')
