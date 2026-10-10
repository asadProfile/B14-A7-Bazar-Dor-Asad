"use client";

/**
 * Browser-side BetterAuth client. Every component that signs a user in or out
 * goes through this so the React session store stays in sync app-wide.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signUp, signOut, useSession, updateUser } = authClient;
