/** Shared constants used across pages and components. */

/**
 * DOM id of the "সব পণ্য" section on the home page. The hero CTA is an anchor
 * link to this id — kept here so the two never drift apart.
 */
export const ALL_PRODUCTS_ANCHOR = "সব-পণ্য";

/** How many risers / fallers the home page rails show. */
export const MOVERS_LIMIT = 6;

/** Options for the category page's "সাজান" control (challenge requirement C1). */
export const SORT_OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "default";

export function isSortValue(value: string | null | undefined): value is SortValue {
  return SORT_OPTIONS.some((o) => o.value === value);
}
