import { NextResponse } from "next/server";

import { dbTarget, pingDatabase } from "@/lib/db";

/** Node APIs are required by the SQLite driver. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment diagnostic.
 *
 * Reports which database the app resolved to and whether its schema is usable.
 * The session-backed pages fail with an opaque digest when the database is
 * unreachable from the serverless runtime, and Vercel's runtime logs need
 * dashboard access to read — this surfaces the same information over HTTP.
 *
 * It never returns the connection URL or any credential, only a label.
 */
export async function GET() {
  const target = dbTarget();

  try {
    const users = await pingDatabase();
    return NextResponse.json({
      ok: true,
      database: target,
      schemaReady: true,
      users,
      persistent: target !== "ephemeral-tmp",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: target,
        schemaReady: false,
        persistent: target !== "ephemeral-tmp",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
