import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/** Drizzle + libSQL need Node APIs, so this route must not run on the edge. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const { GET, POST } = toNextJsHandler(auth.handler);
