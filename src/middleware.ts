import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate for the protected routes.
 *
 * This only checks that a session cookie is *present* — it does not validate
 * it, because the middleware runs on the edge where the database is not
 * reachable. The real check happens in the page itself (`getServerSession`),
 * so a forged cookie still cannot read protected data.
 */
const PROTECTED_PREFIXES = ["/product/", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix),
  );
  if (!isProtected) return NextResponse.next();

  if (getSessionCookie(request)) return NextResponse.next();

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
