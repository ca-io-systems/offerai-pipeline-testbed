import { Database } from 'bun:sqlite'

const sqlite = new Database('sqlite.db')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    is_host INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    host_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    price_per_night REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('published', 'draft', 'paused')),
    rating REAL,
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    location TEXT,
    max_guests INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    listing_id TEXT NOT NULL REFERENCES listings(id),
    guest_id TEXT NOT NULL REFERENCES users(id),
    check_in INTEGER NOT NULL,
    check_out INTEGER NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 1,
    total_price REAL NOT NULL,
    service_fee REAL NOT NULL DEFAULT 0,
    host_payout REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK(payout_status IN ('pending', 'processing', 'paid')),
    created_at INTEGER NOT NULL
  );
`)

console.log('Database schema pushed successfully!')
