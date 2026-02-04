import { Database } from "bun:sqlite";

const db = new Database("app.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

export { db };

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: string | null;
  createdAt: string;
}

export interface Session {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
}
