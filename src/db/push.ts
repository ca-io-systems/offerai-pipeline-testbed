import { Database } from 'bun:sqlite'

const db = new Database('sqlite.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS amenity_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    category_id INTEGER REFERENCES amenity_categories(id)
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price_per_night REAL NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    guests INTEGER DEFAULT 2,
    bedrooms INTEGER DEFAULT 1,
    beds INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    rating REAL,
    review_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS listing_amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    amenity_id INTEGER NOT NULL REFERENCES amenities(id)
  );
`)

console.log('Database schema pushed successfully!')
