/**
 * Data access layer for the BazarDor API.
 *
 * The upstream service is a public demo API, so it is occasionally slow or
 * rate-limited. To make sure a deployed build never renders an error page we
 * walk a list of mirror base URLs and finally fall back to the JSON snapshot
 * bundled in `src/data/` (captured from the same endpoints).
 *
 * All pages read from `getProducts()` — the payload is only 33 records, so a
 * single cached request covers the home page, category pages, the risers /
 * fallers rails and the `[slug]` detail lookup alike.
 */

import type { Category, Product } from "./types";
import fallbackProducts from "@/data/products.json";
import fallbackCategories from "@/data/categories.json";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
] as const;

/** Six hours — prices are "today's rates" and rarely change intraday. */
const REVALIDATE_SECONDS = 60 * 60 * 6;

const LOCAL_PRODUCTS = fallbackProducts as Product[];
const LOCAL_CATEGORIES = fallbackCategories as Category[];

/**
 * The upstream sometimes answers with a bare array and sometimes with a
 * `{ status, data }` envelope, so unwrap defensively.
 */
function unwrap<T>(payload: unknown): T | null {
  if (Array.isArray(payload)) return payload as T;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as T;
  }
  return null;
}

async function fetchJson(path: string): Promise<unknown> {
  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { accept: "application/json" },
      });
      if (!res.ok) continue;

      // A rate-limited mirror can answer 200 with an HTML error page.
      const text = await res.text();
      if (!text.trimStart().startsWith("{") && !text.trimStart().startsWith("[")) {
        continue;
      }
      return JSON.parse(text) as unknown;
    } catch {
      // Network error / DNS failure / malformed JSON — try the next mirror.
    }
  }
  return null;
}

/** Every product, newest fetch first, bundled snapshot as the safety net. */
export async function getProducts(): Promise<Product[]> {
  const remote = unwrap<Product[]>(await fetchJson("/products"));
  if (remote && remote.length > 0) return remote;
  return LOCAL_PRODUCTS;
}

/** Category list used by the navbar and the category pages. */
export async function getCategories(): Promise<Category[]> {
  const remote = unwrap<Category[]>(await fetchJson("/categories"));
  if (remote && remote.length > 0) return remote;
  return LOCAL_CATEGORIES;
}

/** Products belonging to one category slug; `[]` for an unknown slug. */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === slug);
}

/**
 * Looks a product up by slug.
 *
 * The upstream `/products/:id` route only accepts numeric ids, so slug
 * resolution happens against the cached list instead.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

/** A category record by slug, or `null` when the slug is unknown. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * The six products with the largest rise / fall today. `flat` products are
 * excluded — a 0% move is neither a riser nor a faller.
 */
export function splitMovers(products: Product[], limit = 6) {
  const risers = products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);

  const fallers = products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit);

  return { risers, fallers };
}
