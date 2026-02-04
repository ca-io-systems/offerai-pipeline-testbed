import { Database } from 'bun:sqlite'

const db = new Database('sqlite.db')

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS hosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    is_superhost INTEGER NOT NULL DEFAULT 0,
    join_date TEXT NOT NULL,
    response_rate INTEGER NOT NULL DEFAULT 100,
    response_time TEXT NOT NULL DEFAULT 'within an hour'
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    cleaning_fee REAL NOT NULL,
    service_fee REAL NOT NULL,
    guests INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    baths INTEGER NOT NULL,
    host_id INTEGER NOT NULL REFERENCES hosts(id),
    avg_rating REAL NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS listing_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS listing_amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    amenity_id INTEGER NOT NULL REFERENCES amenities(id)
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    author_name TEXT NOT NULL,
    author_avatar_url TEXT NOT NULL,
    date TEXT NOT NULL,
    text TEXT NOT NULL,
    rating REAL NOT NULL,
    cleanliness REAL NOT NULL,
    accuracy REAL NOT NULL,
    check_in REAL NOT NULL,
    communication REAL NOT NULL,
    location REAL NOT NULL,
    value REAL NOT NULL
  )
`)

console.log('Database schema pushed successfully!')
