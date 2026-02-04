import { db, type Session, type User, type PublicUser } from "../db/schema";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createSession(userId: number): Session {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  const stmt = db.prepare(
    "INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?) RETURNING *"
  );
  return stmt.get(userId, token, expiresAt) as Session;
}

export function getSessionByToken(token: string): Session | null {
  const stmt = db.prepare("SELECT * FROM sessions WHERE token = ?");
  const session = stmt.get(token) as Session | null;
  
  if (!session) return null;
  
  if (new Date(session.expiresAt) < new Date()) {
    deleteSession(token);
    return null;
  }
  
  return session;
}

export function deleteSession(token: string): void {
  const stmt = db.prepare("DELETE FROM sessions WHERE token = ?");
  stmt.run(token);
}

export function deleteUserSessions(userId: number): void {
  const stmt = db.prepare("DELETE FROM sessions WHERE userId = ?");
  stmt.run(userId);
}

export function getUserFromSession(token: string): PublicUser | null {
  const session = getSessionByToken(token);
  if (!session) return null;

  const stmt = db.prepare("SELECT id, email, name, avatar FROM users WHERE id = ?");
  return stmt.get(session.userId) as PublicUser | null;
}

export function getCurrentUser(request: Request): PublicUser | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies.session;
  if (!sessionToken) return null;

  return getUserFromSession(sessionToken);
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(";");
  
  for (const pair of pairs) {
    const [name, ...rest] = pair.split("=");
    const value = rest.join("=");
    if (name && value) {
      cookies[name.trim()] = decodeURIComponent(value.trim());
    }
  }
  
  return cookies;
}

export function createSessionCookie(token: string, expiresAt: string): string {
  return `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(expiresAt).toUTCString()}`;
}

export function clearSessionCookie(): string {
  return "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
}
