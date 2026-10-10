import type { ReactNode } from "react";

/**
 * Section title with the `▲` / `▼` glyph the Figma puts in front of the
 * risers and fallers rails.
 */
export function SectionHeading({
  glyph,
  glyphClassName,
  title,
  subtitle,
  action,
}: {
  glyph?: string;
  glyphClassName?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-[1.35rem] font-bold text-ink sm:text-2xl">
          {glyph ? (
            <span aria-hidden="true" className={glyphClassName}>
              {glyph}
            </span>
          ) : null}
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Responsive product grid shared by all three home sections and the category page. */
export function ProductGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}
