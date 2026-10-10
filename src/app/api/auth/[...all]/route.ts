import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { dbReady } from "@/lib/db";

/** Drizzle + libSQL need Node APIs, so this route must not run on the edge. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth.handler);

/**
 * Every auth call hits the database, so wait for the schema first.
 *
 * On serverless hosts the SQLite file lives in an ephemeral directory that is
 * empty at each cold start, meaning the DDL re-runs per instance. Calling
 * straight through would let the first request race those `CREATE TABLE`
 * statements and fail with "no such table".
 */
export async function GET(request: Request): Promise<Response> {
  await dbReady();
  return handlers.GET(request);
}

export async function POST(request: Request): Promise<Response> {
  await dbReady();
  return handlers.POST(request);
}
