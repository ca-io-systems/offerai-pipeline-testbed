import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { isProtectedPath, authMiddleware } from "./auth";
import { createSession } from "../auth/session";
import { db } from "../db/schema";

describe("isProtectedPath", () => {
  test("returns true for /dashboard", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
  });

  test("returns true for /dashboard/settings", () => {
    expect(isProtectedPath("/dashboard/settings")).toBe(true);
  });

  test("returns true for /bookings", () => {
    expect(isProtectedPath("/bookings")).toBe(true);
  });

  test("returns true for /bookings/123", () => {
    expect(isProtectedPath("/bookings/123")).toBe(true);
  });

  test("returns true for /messages", () => {
    expect(isProtectedPath("/messages")).toBe(true);
  });

  test("returns true for /messages/456", () => {
    expect(isProtectedPath("/messages/456")).toBe(true);
  });

  test("returns true for /wishlists", () => {
    expect(isProtectedPath("/wishlists")).toBe(true);
  });

  test("returns true for /wishlists/789", () => {
    expect(isProtectedPath("/wishlists/789")).toBe(true);
  });

  test("returns false for /", () => {
    expect(isProtectedPath("/")).toBe(false);
  });

  test("returns false for /login", () => {
    expect(isProtectedPath("/login")).toBe(false);
  });

  test("returns false for /signup", () => {
    expect(isProtectedPath("/signup")).toBe(false);
  });

  test("returns false for /about", () => {
    expect(isProtectedPath("/about")).toBe(false);
  });
});

describe("authMiddleware", () => {
  let testUserId: number;

  beforeEach(() => {
    db.run("DELETE FROM sessions");
    db.run("DELETE FROM users WHERE email LIKE 'test-middleware-%'");
    const result = db
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id")
      .get("test-middleware-user@example.com", "hashed", "Test User") as { id: number };
    testUserId = result.id;
  });

  afterEach(() => {
    db.run("DELETE FROM sessions WHERE userId = ?", [testUserId]);
    db.run("DELETE FROM users WHERE id = ?", [testUserId]);
  });

  test("returns null for public paths", () => {
    const request = new Request("http://localhost/");
    const response = authMiddleware(request);
    expect(response).toBeNull();
  });

  test("redirects to /login for protected path without session", () => {
    const request = new Request("http://localhost/dashboard");
    const response = authMiddleware(request);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(302);
    expect(response!.headers.get("Location")).toContain("/login");
  });

  test("includes redirect param in login URL", () => {
    const request = new Request("http://localhost/dashboard/settings");
    const response = authMiddleware(request);
    expect(response).not.toBeNull();
    const location = response!.headers.get("Location");
    expect(location).toContain("redirect=%2Fdashboard%2Fsettings");
  });

  test("returns null for protected path with valid session", () => {
    const session = createSession(testUserId);
    const request = new Request("http://localhost/dashboard", {
      headers: { Cookie: `session=${session.token}` },
    });
    const response = authMiddleware(request);
    expect(response).toBeNull();
  });

  test("redirects for protected path with invalid session", () => {
    const request = new Request("http://localhost/dashboard", {
      headers: { Cookie: "session=invalid-token" },
    });
    const response = authMiddleware(request);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(302);
  });
});
