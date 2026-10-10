import Link from "next/link";

import { ChangeBadge } from "./change-badge";
import { bnNumber, unitLabel } from "@/lib/bn";
import type { Product } from "@/lib/types";

/** Product tile used on the home page and on every category page. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card-surface group flex flex-col p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_12px_28px_-16px_rgb(5_137_62/0.45)]"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[#f3f7f3] text-[1.35rem] leading-none"
        >
          {product.image}
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="truncate text-[1.0625rem] font-bold text-ink group-hover:text-brand-700">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 truncate text-[0.8125rem] text-muted">
            {unitLabel(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[0.8125rem] text-muted">আজকের দাম</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <p className="text-[1.375rem] font-bold text-ink">
            {bnNumber(product.today)}{" "}
            <span className="text-[0.9375rem] font-semibold">টাকা</span>
          </p>
          <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
        </div>
      </div>
    </Link>
  );
}
