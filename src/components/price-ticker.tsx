import { bnNumber, changeLabel, unitShort } from "@/lib/bn";
import type { Product } from "@/lib/types";

const DIR_CLASS: Record<Product["change"]["dir"], string> = {
  up: "text-up",
  down: "text-down",
  flat: "text-flat",
};

function TickerItem({ product }: { product: Product }) {
  return (
    <li className="flex shrink-0 items-center gap-2 px-5 text-[0.8125rem] whitespace-nowrap sm:gap-2.5 sm:px-6 sm:text-sm">
      <span aria-hidden="true" className="text-base leading-none">
        {product.image}
      </span>
      <span className="font-medium text-ink">{product.nameBn}</span>
      <span className="text-muted">
        {bnNumber(product.today)} টাকা/{unitShort(product.unit)}
      </span>
      <span
        className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${DIR_CLASS[product.change.dir]}`}
      >
        {changeLabel(product.change.dir, product.change.pct)}
      </span>
    </li>
  );
}

/**
 * Infinite price marquee that sits directly under the navbar.
 *
 * The list is rendered twice inside a `w-max` track and translated by -50%,
 * which makes the loop seamless no matter how many products there are.
 * Hovering pauses it, and `prefers-reduced-motion` stops it entirely.
 */
export function PriceTicker({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="ticker-viewport overflow-hidden border-y border-line bg-white">
      <div className="ticker-track py-2.5">
        <ul className="flex items-center" aria-label="আজকের বাজার দর">
          {products.map((p) => (
            <TickerItem key={p.id} product={p} />
          ))}
        </ul>
        {/* Duplicate copy — purely presentational, hidden from assistive tech. */}
        <ul className="flex items-center" aria-hidden="true">
          {products.map((p) => (
            <TickerItem key={`dup-${p.id}`} product={p} />
          ))}
        </ul>
      </div>
    </div>
  );
}
