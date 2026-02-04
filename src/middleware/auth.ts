import { getCurrentUser } from "../auth/session";

const PROTECTED_PATHS = ["/dashboard", "/bookings", "/messages", "/wishlists"];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function authMiddleware(request: Request): Response | null {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!isProtectedPath(pathname)) {
    return null;
  }

  const user = getCurrentUser(request);

  if (!user) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl.toString(), 302);
  }

  return null;
}
