import { headers } from "next/headers";

import { auth } from "./auth";
import { dbReady } from "./db";

/**
 * Reads the current session inside a Server Component.
 *
 * Returns `null` when signed out. Route handlers and pages that need a user
 * should redirect themselves — see `requireSession` below.
 */
export async function getServerSession() {
  // The session table must exist before BetterAuth queries it.
  await dbReady();

  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    // A misconfigured or unreachable auth layer must not take the whole page
    // down. BetterAuth throws outright when BETTER_AUTH_SECRET is unset in
    // production, which turned /signin and /signup into a bare server-side
    // exception instead of a sign-in form. Treat the visitor as signed out;
    // the route then decides what to do, and /api/health reports the cause.
    console.error("[bazardor] session lookup failed:", error);
    return null;
  }
}

/** Same as `getServerSession`, but the caller must handle the signed-out case. */
export async function requireSession(redirectTo: string) {
  const session = await getServerSession();
  return { session, redirectTo };
}
