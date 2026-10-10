/**
 * BetterAuth server instance — email/password plus Google and GitHub.
 *
 * Social providers are registered only when their credentials are present in
 * the environment; the UI reads `socialProvidersEnabled` below to decide
 * whether to offer the button or explain that the provider is not configured.
 *
 * Email verification and password reset are intentionally switched off, as the
 * assignment brief asks.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db, schema } from "./db";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const githubClientId = process.env.GITHUB_CLIENT_ID ?? "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET ?? "";

export const socialProvidersEnabled = {
  google: Boolean(googleClientId && googleClientSecret),
  github: Boolean(githubClientId && githubClientSecret),
} as const;

/** Origins allowed to POST to the auth routes — local dev plus the deployment. */
function trustedOrigins(): string[] {
  const origins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  for (const key of ["BETTER_AUTH_URL", "NEXT_PUBLIC_APP_URL"] as const) {
    const value = process.env[key];
    if (value) origins.push(value.replace(/\/$/, ""));
  }
  // Vercel exposes the generated URL for preview deployments.
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  return origins;
}

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },
  socialProviders: {
    ...(socialProvidersEnabled.google
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
    ...(socialProvidersEnabled.github
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the cookie once a day
  },
  trustedOrigins: trustedOrigins(),
  // Must stay last: it lets server actions and route handlers write cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
