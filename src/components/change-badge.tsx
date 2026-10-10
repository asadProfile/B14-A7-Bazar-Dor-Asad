import { changeLabel } from "@/lib/bn";
import type { TrendDir } from "@/lib/types";

/**
 * The ▲ / ▼ / — percentage chip shown on every product card and table row.
 *
 * Colours are from the buyer's point of view, matching the Figma: a price rise
 * is shown in red, a fall in green, and no change in grey.
 */
const STYLES: Record<TrendDir, string> = {
  up: "bg-up-soft text-up",
  down: "bg-down-soft text-down",
  flat: "bg-flat-soft text-flat",
};

export function ChangeBadge({
  dir,
  pct,
  size = "md",
}: {
  dir: TrendDir;
  pct: number;
  size?: "md" | "lg";
}) {
  const sizing =
    size === "lg"
      ? "px-2.5 py-1 text-sm"
      : "px-2 py-1 text-[0.75rem]";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md font-semibold tabular-nums ${STYLES[dir]} ${sizing}`}
    >
      {changeLabel(dir, pct)}
      <span className="sr-only">
        {dir === "up" ? " দাম বেড়েছে" : dir === "down" ? " দাম কমেছে" : " অপরিবর্তিত"}
      </span>
    </span>
  );
}
