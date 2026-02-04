import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.run(`
  CREATE TABLE IF NOT EXISTS hosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT,
    superhost INTEGER DEFAULT 0
  )
`)

sqlite.run(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    property_type TEXT NOT NULL,
    room_type TEXT NOT NULL,
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    bathrooms REAL NOT NULL,
    amenities TEXT NOT NULL,
    images TEXT NOT NULL,
    rating REAL,
    review_count INTEGER DEFAULT 0,
    host_id INTEGER NOT NULL,
    instant_book INTEGER DEFAULT 0,
    created_at INTEGER
  )
`)

console.log('Database schema pushed successfully!')
