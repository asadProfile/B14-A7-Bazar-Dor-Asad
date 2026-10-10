"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { SORT_OPTIONS, type SortValue } from "@/lib/constants";

/**
 * Challenge requirement C1 — the "সাজান" dropdown.
 *
 * The choice lives in the URL (`?sort=price-asc`) so a sorted view can be
 * shared or reloaded, and so the server renders the ordered list. The pending
 * transition is what lets the route-level `loading.tsx` skeleton appear.
 */
export function SortSelect({ value }: { value: SortValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next === "default") {
      params.delete("sort");
    } else {
      params.set("sort", next);
    }
    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <label className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted">সাজান</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isPending}
          aria-label="পণ্য সাজানোর নিয়ম"
          className="w-full appearance-none rounded-lg border border-line bg-white py-2 pr-9 pl-3.5 text-sm font-medium text-ink transition-colors hover:border-brand-200 focus:border-brand-500 focus:outline-none disabled:opacity-60"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
        />
      </span>
    </label>
  );
}
