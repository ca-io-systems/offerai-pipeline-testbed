import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price_per_night REAL NOT NULL,
    cleaning_fee REAL NOT NULL DEFAULT 0,
    max_guests INTEGER NOT NULL DEFAULT 1,
    min_nights INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    host_name TEXT,
    location TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guests INTEGER NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL
  );
`)

console.log('Database schema pushed successfully!')
