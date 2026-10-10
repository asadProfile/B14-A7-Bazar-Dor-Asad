import { bnNumber, unitLabel } from "@/lib/bn";
import type { Product } from "@/lib/types";

const HEADINGS = ["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বোচ্চ", "গড়"] as const;

/** Row average — the midpoint of that bazar's low and high quote. */
function rowAverage(min: number, max: number): number {
  return Math.round(((min + max) / 2) * 100) / 100;
}

function Taka({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      {bnNumber(value)}
      <span className="text-muted"> টাকা</span>
    </span>
  );
}

/**
 * "বাজারভিত্তিক আজকের দাম" — every bazar's quote for one product.
 *
 * Rendered as a real table from `md` up and as stacked rows below it, so the
 * five columns never force a horizontal scroll on a phone.
 */
export function MarketTable({ product }: { product: Product }) {
  const markets = product.markets ?? [];

  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-ink">বাজারভিত্তিক আজকের দাম</h2>
        <p className="mt-1 text-sm text-muted">
          {bnNumber(markets.length)}টি বাজারে {product.nameBn}-এর আজকের
          সর্বনিম্ন, সর্বোচ্চ ও গড় দর ({unitLabel(product.unit)} হিসাবে)
        </p>
      </div>

      {/* Table — tablet and up */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7faf7] text-left text-muted">
              {HEADINGS.map((heading, i) => (
                <th
                  key={heading}
                  scope="col"
                  className={`px-5 py-3 font-semibold sm:px-6 ${i >= 2 ? "text-right" : ""}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => (
              <tr
                key={`${m.market}-${m.division}`}
                className="border-t border-line transition-colors hover:bg-brand-50/50"
              >
                <th
                  scope="row"
                  className="px-5 py-3.5 text-left font-semibold text-ink sm:px-6"
                >
                  {m.market}
                </th>
                <td className="px-5 py-3.5 text-muted sm:px-6">{m.division}</td>
                <td className="px-5 py-3.5 text-right font-medium text-down sm:px-6">
                  <Taka value={m.min} />
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-up sm:px-6">
                  <Taka value={m.max} />
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-ink sm:px-6">
                  <Taka value={rowAverage(m.min, m.max)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked rows — phones */}
      <ul className="divide-y divide-line md:hidden">
        {markets.map((m) => (
          <li key={`${m.market}-${m.division}`} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-ink">{m.market}</p>
              <p className="text-xs text-muted">{m.division}</p>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted">সর্বনিম্ন</dt>
                <dd className="mt-0.5 font-medium text-down">
                  <Taka value={m.min} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">সর্বোচ্চ</dt>
                <dd className="mt-0.5 font-medium text-up">
                  <Taka value={m.max} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">গড়</dt>
                <dd className="mt-0.5 font-bold text-ink">
                  <Taka value={rowAverage(m.min, m.max)} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
