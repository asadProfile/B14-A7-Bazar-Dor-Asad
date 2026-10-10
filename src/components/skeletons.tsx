import { ProductGrid } from "./section-heading";

/** Mirrors `ProductCard`'s footprint so the grid does not jump when data lands. */
export function ProductCardSkeleton() {
  return (
    <div className="card-surface p-4">
      <div className="flex items-start gap-3">
        <div className="skeleton h-11 w-11 shrink-0 rounded-[10px]" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-20" />
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  label = "পণ্যের দাম লোড হচ্ছে…",
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ProductGrid>
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </ProductGrid>
    </div>
  );
}

/** Full-page skeleton for a product detail route. */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6" role="status" aria-live="polite">
      <span className="sr-only">পণ্যের বিস্তারিত তথ্য লোড হচ্ছে…</span>
      <div className="skeleton h-4 w-64" />
      <div className="card-surface mt-6 p-6">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-6 w-52" />
            <div className="skeleton h-4 w-36" />
            <div className="skeleton h-4 w-72" />
          </div>
        </div>
      </div>
      <div className="card-surface mt-6 p-6">
        <div className="skeleton h-5 w-48" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the "Bazarভিত্তিক আজকের দাম" table. */
export function MarketTableSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <span className="sr-only">বাজারের তালিকা লোড হচ্ছে…</span>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton h-11" />
      ))}
    </div>
  );
}
