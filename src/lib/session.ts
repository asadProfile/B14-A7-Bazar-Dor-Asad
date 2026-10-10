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
  return auth.api.getSession({ headers: await headers() });
}

/** Same as `getServerSession`, but the caller must handle the signed-out case. */
export async function requireSession(redirectTo: string) {
  const session = await getServerSession();
  return { session, redirectTo };
}
