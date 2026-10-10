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

const LOCAL_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

/**
 * Origins allowed to POST to the auth routes.
 *
 * Any localhost origin is accepted so that `next dev` picking a fallback port
 * (`:3001` when `:3000` is taken) or a local `next start` on a custom port does
 * not fail with a confusing "Invalid origin" error. That is not a CSRF hole:
 * a remote page cannot present itself as `http://localhost`, and the session
 * cookie for a deployed domain is never sent to a localhost origin.
 *
 * Everything else must be listed explicitly via BETTER_AUTH_URL /
 * NEXT_PUBLIC_APP_URL, or be the current Vercel deployment's own URL.
 */
function trustedOrigins(): string[] | ((request?: Request) => string[]) {
  const configured = new Set<string>();
  for (const key of ["BETTER_AUTH_URL", "NEXT_PUBLIC_APP_URL"] as const) {
    const value = process.env[key];
    if (value) configured.add(value.replace(/\/$/, ""));
  }
  // Vercel exposes the auto-generated URL for preview and production deploys.
  if (process.env.VERCEL_URL) configured.add(`https://${process.env.VERCEL_URL}`);

  const allowed = [...configured];

  return (request?: Request) => {
    const origin = request?.headers.get("origin");
    if (origin && LOCAL_ORIGIN_RE.test(origin)) return [...allowed, origin];
    return allowed;
  };
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
    // The brief asks for registration to hand the user over to the sign-in
    // page, so a successful sign-up must not open a session of its own.
    autoSignIn: false,
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
