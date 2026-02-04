import { Database } from 'bun:sqlite'

const db = new Database('sqlite.db')

// Seed users
db.run(`
  INSERT OR IGNORE INTO users (id, name, email, created_at)
  VALUES 
    ('user-1', 'John Doe', 'john@example.com', unixepoch()),
    ('user-2', 'Jane Smith', 'jane@example.com', unixepoch()),
    ('user-3', 'Bob Wilson', 'bob@example.com', unixepoch())
`)

// Seed a listing
db.run(`
  INSERT OR IGNORE INTO listings (id, host_id, title, description, price_per_night, created_at)
  VALUES 
    ('listing-1', 'user-2', 'Cozy Beach House', 'A beautiful beach house with ocean views', 150, unixepoch())
`)

// Seed some notifications for user-1
db.run(`
  INSERT OR IGNORE INTO notifications (id, user_id, type, title, body, link_url, is_read, created_at)
  VALUES 
    ('notif-1', 'user-1', 'booking_confirmed', 'Booking Confirmed!', 'Your booking for "Cozy Beach House" has been confirmed', '/bookings/booking-1', 0, unixepoch() - 3600),
    ('notif-2', 'user-1', 'message_received', 'New Message', 'Jane Smith: Looking forward to hosting you!', '/messages/user-2', 0, unixepoch() - 7200),
    ('notif-3', 'user-1', 'review_received', 'New Review', 'Jane Smith left you a 5-star review', '/reviews/review-1', 1, unixepoch() - 86400)
`)

console.log('Database seeded successfully!')
