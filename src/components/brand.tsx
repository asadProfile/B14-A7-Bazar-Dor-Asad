import Link from "next/link";

/**
 * The `🛒 বাজার দর` lockup from the Figma: a green tile holding a cart glyph,
 * with the wordmark — and optionally the Bangla date — stacked beside it.
 */

export function CartGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 4h2.2l1.1 4.2" />
      <path d="M6.1 8.2h12.6a1 1 0 0 1 .97 1.24l-1.5 5.6a1.6 1.6 0 0 1-1.55 1.18H8.6a1.6 1.6 0 0 1-1.55-1.2L5.3 5.6A1 1 0 0 0 4.32 4.8H3" />
      <circle cx="9.4" cy="19.3" r="1.5" />
      <circle cx="16.6" cy="19.3" r="1.5" />
    </svg>
  );
}

export function BrandMark({
  date,
  size = "md",
}: {
  date?: string;
  size?: "sm" | "md";
}) {
  const tile = size === "sm" ? "h-9 w-9 rounded-[10px]" : "h-11 w-11 rounded-xl";
  const glyph = size === "sm" ? "h-[18px] w-[18px]" : "h-6 w-6";
  const title = size === "sm" ? "text-lg" : "text-[1.4rem]";

  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5"
      aria-label="বাজার দর — হোম পেজ"
    >
      <span className={`relative grid ${tile} place-items-center bg-brand-600`}>
        <CartGlyph className={`${glyph} text-white`} />
        {/* Small accent dot on the tile's top-right corner. */}
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`${title} font-bold tracking-tight text-ink`}>
          বাজার <span className="text-brand-600">দর</span>
        </span>
        {date ? (
          <span className="mt-1.5 text-[0.7rem] font-medium text-muted">
            {date}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
