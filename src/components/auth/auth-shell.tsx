import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

/** Page heading + centred card shared by the sign-in and sign-up routes. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-muted">
          {subtitle}
        </p>

        <div className="card-surface mt-7 p-5 sm:p-6">{children}</div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Labelled form field with an inline error line under the input. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-up">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Placeholder shown while the client form hydrates. */
export function AuthFormSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-live="polite">
      <span className="sr-only">ফর্ম লোড হচ্ছে…</span>
      <div className="skeleton h-11" />
      <div className="skeleton h-11" />
      <div className="skeleton h-11" />
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-muted/60 transition-colors focus:border-brand-500 focus:outline-none disabled:opacity-60 aria-[invalid=true]:border-up";
