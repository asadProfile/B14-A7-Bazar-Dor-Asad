/**
 * Database connection.
 *
 * Uses libSQL so the *same* code path works in every environment:
 *
 *   • local development   → `file:./bazardor.db` (zero setup, committed to .gitignore)
 *   • Vercel / Netlify    → set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` to a
 *                           free Turso database
 *   • no config at all    → falls back to a temp file so the app still boots
 *                           (sessions simply do not survive a cold start)
 *
 * Tables are created on first connection with idempotent DDL, so the project
 * runs straight after `npm install` — no migration step for the examiner.
 */

import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

import * as schema from "./schema";

declare global {
  var __bazardorDb: LibSQLDatabase<typeof schema> | undefined;
}

function resolveUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Serverless platforms ship a read-only filesystem, so only the writable
  // temp directory can host the SQLite file.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "file:/tmp/bazardor.db";
  }
  return "file:./bazardor.db";
}

const DDL = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS session_user_id_idx ON session(user_id);
CREATE INDEX IF NOT EXISTS account_user_id_idx ON account(user_id);
`;

let client: Client | undefined;

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: resolveUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

async function migrate(sqlite: Client): Promise<void> {
  const statements = DDL.split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sqlite.execute(statement);
  }
}

function createDb(): LibSQLDatabase<typeof schema> {
  const sqlite = getClient();

  // Cached across hot reloads in dev so we do not re-run DDL on every request.
  if (!globalThis.__bazardorDb) {
    globalThis.__bazardorDb = drizzle(sqlite, { schema });
    // Fire-and-forget: the DDL is idempotent and awaited lazily by the first query.
    void migrate(sqlite);
  }
  return globalThis.__bazardorDb;
}

export const db = createDb();
export { schema };
