import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    region TEXT,
    country TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    image_url TEXT,
    is_popular INTEGER DEFAULT 0
  )
`)

sqlite.run(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    price_per_night REAL NOT NULL,
    max_guests INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    image_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

console.log('Database schema pushed successfully!')
