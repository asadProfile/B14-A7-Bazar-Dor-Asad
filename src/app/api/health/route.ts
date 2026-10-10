import { NextResponse } from "next/server";

import { dbTarget, pingDatabase } from "@/lib/db";

/** Node APIs are required by the SQLite driver. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment diagnostic.
 *
 * Reports which database the app resolved to, whether its schema is usable, and
 * which environment variables the auth layer can see. The session-backed pages
 * fail with an opaque digest when any of that is misconfigured, and Vercel's
 * runtime logs need dashboard access to read — this surfaces the same
 * information over HTTP.
 *
 * It never returns the connection URL or any credential, only a label and
 * booleans.
 */
export async function GET() {
  const target = dbTarget();

  // Booleans only — never the values. BetterAuth throws in production when
  // BETTER_AUTH_SECRET is unset, which is the failure this reports.
  const config = {
    authSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    appUrl: Boolean(process.env.BETTER_AUTH_URL),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  };

  try {
    const users = await pingDatabase();
    return NextResponse.json({
      ok: true,
      database: target,
      schemaReady: true,
      users,
      persistent: target !== "ephemeral-tmp",
      config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: target,
        schemaReady: false,
        persistent: target !== "ephemeral-tmp",
        config,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
