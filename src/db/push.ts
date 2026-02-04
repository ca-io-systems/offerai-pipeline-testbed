import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    host_name TEXT NOT NULL,
    is_superhost INTEGER DEFAULT 0,
    created_at INTEGER
  )
`)

console.log('Database schema pushed successfully!')
