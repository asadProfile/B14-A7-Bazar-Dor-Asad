import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { ChangeBadge } from "@/components/change-badge";
import { MarketTable } from "@/components/market-table";
import { getProductBySlug } from "@/lib/api";
import {
  bnNumber,
  priceMovementSentence,
  priceSummary,
  unitLabel,
  unitShort,
} from "@/lib/bn";
import { getServerSession } from "@/lib/session";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Rendered per request, never prerendered.
 *
 * The page reads the session, so a build-time render would bake in the
 * signed-out redirect and every product URL would bounce to `/signin` in
 * production. Dynamic rendering also means a direct reload of
 * `/product/<slug>` always resolves against the database.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "পণ্য পাওয়া যায়নি" };

  return {
    title: `${product.nameBn} — আজকের দাম`,
    description: `${product.nameBn}-এর আজকের বাজার দর, বাজারভিত্তিক সর্বনিম্ন-সর্বোচ্চ ও গড় দাম এবং গতকালের তুলনায় পরিবর্তন।`,
  };
}

/**
 * Product details — a protected route.
 *
 * Signed-out visitors are bounced to `/signin` with a `next` parameter so the
 * sign-in page can return them here (middleware does the same check earlier,
 * this is the authoritative one).
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [session, product] = await Promise.all([
    getServerSession(),
    getProductBySlug(slug),
  ]);

  if (!session?.user) {
    redirect(`/signin?next=${encodeURIComponent(`/product/${slug}`)}`);
  }

  if (!product) notFound();

  const summary = priceSummary(product);
  const unit = unitLabel(product.unit);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb */}
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-700">
              হোম
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          <li>
            <Link
              href={`/category/${product.category}`}
              className="transition-colors hover:text-brand-700"
            >
              {product.categoryNameBn}
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          <li aria-current="page" className="font-medium text-ink">
            {product.nameBn}
          </li>
        </ol>
      </nav>

      {/* ---------- Summary ---------- */}
      <section className="card-surface p-5 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden="true"
              className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#f3f7f3] text-3xl leading-none"
            >
              {product.image}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-ink sm:text-[1.75rem]">
                {product.nameBn}
              </h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                <span>{unit}</span>
                <span aria-hidden="true">·</span>
                <Link
                  href={`/category/${product.category}`}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 font-medium text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <span aria-hidden="true">{product.categoryIcon}</span>
                  {product.categoryNameBn}
                </Link>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {priceMovementSentence(product)}
              </p>
            </div>
          </div>

          {/* Today's price callout */}
          <div className="shrink-0 rounded-xl bg-[#f7faf7] px-6 py-4 text-center md:min-w-[11rem]">
            <p className="text-sm text-muted">আজকের দাম</p>
            <p className="mt-1 text-3xl font-bold text-ink">
              {bnNumber(product.today)}
            </p>
            <p className="text-xs text-muted">
              টাকা / {unitShort(product.unit)}
            </p>
            <div className="mt-2 flex justify-center">
              <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Price summary ---------- */}
      <section className="card-surface mt-6 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">দামের সারসংক্ষেপ</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="সর্বনিম্ন দাম"
            value={summary.min}
            note={`সবচেয়ে কম দর — ${summary.minMarket}`}
            valueClassName="text-down"
          />
          <StatCard
            label="সর্বোচ্চ দাম"
            value={summary.max}
            note={`সবচেয়ে বেশি দর — ${summary.maxMarket}`}
            valueClassName="text-up"
          />
          <StatCard
            label="গড় দাম"
            value={summary.avg}
            note={`${unit}-এর হিসাবে সব বাজারের গড়`}
            valueClassName="text-ink"
          />
        </dl>
      </section>

      {/* ---------- Per-bazar table ---------- */}
      <section className="mt-6">
        <MarketTable product={product} />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string;
  value: number;
  note: string;
  valueClassName: string;
}) {
  return (
    <div className="rounded-xl border border-line p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd>
        <p className={`mt-1.5 text-2xl font-bold ${valueClassName}`}>
          {bnNumber(value)}{" "}
          <span className="text-base font-semibold">টাকা</span>
        </p>
        <p className="mt-1 text-xs text-muted">{note}</p>
      </dd>
    </div>
  );
}
