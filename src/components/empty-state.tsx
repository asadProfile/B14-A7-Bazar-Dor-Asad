import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * The shared "nothing here" panel.
 *
 * Used both for a category that holds no products and for unknown slugs, and
 * reused by the global 404 page so every dead end offers the same way out.
 */
export function EmptyState({
  emoji = "🧺",
  title,
  description,
  ctaLabel = "হোম পেজে ফিরে যান",
  ctaHref = "/",
}: {
  emoji?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="card-surface mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-3xl"
      >
        {emoji}
      </span>
      <h2 className="mt-5 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {ctaLabel}
      </Link>
    </div>
  );
}
