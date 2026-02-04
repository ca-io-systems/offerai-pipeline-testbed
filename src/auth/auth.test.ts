import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { hashPassword, verifyPassword } from "./password";
import {
  createSession,
  getSessionByToken,
  deleteSession,
  getUserFromSession,
  getCurrentUser,
  createSessionCookie,
  clearSessionCookie,
} from "./session";
import { signup, login, logout } from "./actions";
import { db } from "../db/schema";

describe("Password hashing", () => {
  test("hashPassword creates a hashed string", async () => {
    const password = "testpassword123";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test("verifyPassword returns true for correct password", async () => {
    const password = "testpassword123";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  test("verifyPassword returns false for incorrect password", async () => {
    const password = "testpassword123";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword("wrongpassword", hash);
    expect(isValid).toBe(false);
  });
});

describe("Session management", () => {
  let testUserId: number;

  beforeEach(() => {
    db.run("DELETE FROM sessions");
    db.run("DELETE FROM users WHERE email LIKE 'test-session-%'");
    const result = db
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id")
      .get("test-session-user@example.com", "hashed", "Test User") as { id: number };
    testUserId = result.id;
  });

  afterEach(() => {
    db.run("DELETE FROM sessions WHERE userId = ?", [testUserId]);
    db.run("DELETE FROM users WHERE id = ?", [testUserId]);
  });

  test("createSession creates a new session", () => {
    const session = createSession(testUserId);
    expect(session.userId).toBe(testUserId);
    expect(session.token).toBeTruthy();
    expect(session.token.length).toBe(64);
    expect(new Date(session.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  test("getSessionByToken returns the session", () => {
    const session = createSession(testUserId);
    const retrieved = getSessionByToken(session.token);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(session.id);
    expect(retrieved!.userId).toBe(testUserId);
  });

  test("getSessionByToken returns null for invalid token", () => {
    const retrieved = getSessionByToken("invalid-token");
    expect(retrieved).toBeNull();
  });

  test("deleteSession removes the session", () => {
    const session = createSession(testUserId);
    deleteSession(session.token);
    const retrieved = getSessionByToken(session.token);
    expect(retrieved).toBeNull();
  });

  test("getUserFromSession returns the user", () => {
    const session = createSession(testUserId);
    const user = getUserFromSession(session.token);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(testUserId);
    expect(user!.email).toBe("test-session-user@example.com");
  });

  test("createSessionCookie creates a valid cookie string", () => {
    const token = "test-token";
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    const cookie = createSessionCookie(token, expiresAt);
    expect(cookie).toContain("session=test-token");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
  });

  test("clearSessionCookie creates a cookie with Max-Age=0", () => {
    const cookie = clearSessionCookie();
    expect(cookie).toContain("session=");
    expect(cookie).toContain("Max-Age=0");
  });

  test("getCurrentUser extracts user from request cookie", () => {
    const session = createSession(testUserId);
    const request = new Request("http://localhost/", {
      headers: { Cookie: `session=${session.token}` },
    });
    const user = getCurrentUser(request);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(testUserId);
  });

  test("getCurrentUser returns null for no cookie", () => {
    const request = new Request("http://localhost/");
    const user = getCurrentUser(request);
    expect(user).toBeNull();
  });
});

describe("Auth actions", () => {
  beforeEach(() => {
    db.run("DELETE FROM sessions");
    db.run("DELETE FROM users WHERE email LIKE 'test-action-%'");
  });

  afterEach(() => {
    db.run("DELETE FROM sessions");
    db.run("DELETE FROM users WHERE email LIKE 'test-action-%'");
  });

  describe("signup", () => {
    test("creates a new user with valid data", async () => {
      const result = await signup(
        "test-action-signup@example.com",
        "password123",
        "Test User"
      );
      expect(result.success).toBe(true);
      expect(result.user).toBeTruthy();
      expect(result.user!.email).toBe("test-action-signup@example.com");
      expect(result.user!.name).toBe("Test User");
      expect(result.cookie).toBeTruthy();
    });

    test("returns error for invalid email", async () => {
      const result = await signup("invalid-email", "password123", "Test User");
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe("Invalid email format");
    });

    test("returns error for short password", async () => {
      const result = await signup("test-action-short@example.com", "short", "Test User");
      expect(result.success).toBe(false);
      expect(result.errors?.password).toBe("Password must be at least 8 characters");
    });

    test("returns error for short name", async () => {
      const result = await signup("test-action-name@example.com", "password123", "T");
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBe("Name must be at least 2 characters");
    });

    test("returns error for duplicate email", async () => {
      await signup("test-action-dup@example.com", "password123", "Test User");
      const result = await signup(
        "test-action-dup@example.com",
        "password123",
        "Another User"
      );
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe("Email already registered");
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await signup("test-action-login@example.com", "password123", "Login User");
    });

    test("logs in with valid credentials", async () => {
      const result = await login("test-action-login@example.com", "password123");
      expect(result.success).toBe(true);
      expect(result.user).toBeTruthy();
      expect(result.user!.email).toBe("test-action-login@example.com");
      expect(result.cookie).toBeTruthy();
    });

    test("returns error for invalid email format", async () => {
      const result = await login("invalid", "password123");
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe("Invalid email format");
    });

    test("returns error for wrong password", async () => {
      const result = await login("test-action-login@example.com", "wrongpassword");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password");
    });

    test("returns error for non-existent user", async () => {
      const result = await login("nonexistent@example.com", "password123");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password");
    });
  });

  describe("logout", () => {
    test("clears the session cookie", async () => {
      const signupResult = await signup(
        "test-action-logout@example.com",
        "password123",
        "Logout User"
      );
      const sessionToken = signupResult.cookie!.split("session=")[1].split(";")[0];

      const request = new Request("http://localhost/", {
        headers: { Cookie: `session=${sessionToken}` },
      });
      const result = logout(request);

      expect(result.success).toBe(true);
      expect(result.cookie).toContain("Max-Age=0");
    });
  });
});
