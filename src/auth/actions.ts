import { db, type User, type PublicUser } from "../db/schema";
import { hashPassword, verifyPassword } from "./password";
import {
  createSession,
  deleteSession,
  createSessionCookie,
  clearSessionCookie,
  getCurrentUser,
} from "./session";

export interface AuthResult {
  success: boolean;
  user?: PublicUser;
  error?: string;
  cookie?: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<AuthResult & { errors?: ValidationErrors }> {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existingUser) {
    return { success: false, errors: { email: "Email already registered" } };
  }

  const hashedPassword = await hashPassword(password);
  
  const stmt = db.prepare(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id, email, name, avatar"
  );
  const user = stmt.get(email, hashedPassword, name) as PublicUser;

  const session = createSession(user.id);
  const cookie = createSessionCookie(session.token, session.expiresAt);

  return { success: true, user, cookie };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult & { errors?: ValidationErrors }> {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | null;
  
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    return { success: false, error: "Invalid email or password" };
  }

  const session = createSession(user.id);
  const cookie = createSessionCookie(session.token, session.expiresAt);

  const publicUser: PublicUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };

  return { success: true, user: publicUser, cookie };
}

export function logout(request: Request): { success: boolean; cookie: string } {
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split("=");
      if (name?.trim() === "session") {
        const token = rest.join("=").trim();
        deleteSession(decodeURIComponent(token));
        break;
      }
    }
  }

  return { success: true, cookie: clearSessionCookie() };
}

export { getCurrentUser };
