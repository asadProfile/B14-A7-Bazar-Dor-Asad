"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

import { BrandMark } from "./brand";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { bnDate } from "@/lib/bn";
import type { Category } from "@/lib/types";

const linkBase =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:px-3.5";

/**
 * Sticky top chrome: the brand row, the category nav row and the auth area.
 *
 * The date is rendered from the server on first paint and refreshed once the
 * component mounts, so it is always correct without a hydration mismatch.
 */
export function SiteHeader({
  categories,
  serverDate,
}: {
  categories: Category[];
  serverDate: string;
}) {
  const pathname = usePathname();
  const [date, setDate] = useState(serverDate);

  useEffect(() => {
    setDate(bnDate());
  }, []);

  const activeSlug = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.slice("/category/".length))
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      {/* Row 1 — brand + auth */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <BrandMark date={date} />
        <AuthArea />
      </div>

      {/* Row 2 — category nav. Scrolls horizontally on narrow screens so every
          category stays reachable instead of collapsing into a hidden menu. */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-line/70 [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        <ul className="mx-auto flex w-max max-w-6xl items-center gap-1 px-4 py-1.5 sm:px-6 md:w-full md:justify-center">
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`${linkBase} ${
                    isActive
                      ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
                      : "text-ink/75 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {category.icon}
                  </span>
                  {category.nameBn}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Auth area — sign-in / sign-up buttons, or the account dropdown
 * ------------------------------------------------------------------ */

function AuthArea() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center gap-2" aria-hidden="true">
        <div className="skeleton h-9 w-20 rounded-lg" />
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/signin"
          className="rounded-lg px-2.5 py-2 text-sm font-semibold text-ink transition-colors hover:text-brand-700 sm:px-3"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:px-4"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return <UserMenu name={session.user.name} email={session.user.email} image={session.user.image} />;
}

function UserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close the menu whenever the route changes.
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  async function handleSignOut() {
    setOpen(false);
    const loadingId = toast.loading("সাইন আউট করা হচ্ছে…");
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।", { id: loadingId });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।", { id: loadingId });
    }
  }

  const initials = name?.trim()?.charAt(0) || "ব";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors hover:bg-brand-50"
      >
        <Avatar name={initials} image={image} />
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-ink sm:block">
          {name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_40px_-16px_rgb(0_0_0/0.25)]"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate font-semibold text-ink">{name}</p>
            <p className="truncate text-sm text-muted">{email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
            >
              <User className="h-4 w-4 text-muted" />
              আমার প্রোফাইল
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-up transition-colors hover:bg-up-soft"
            >
              <LogOut className="h-4 w-4" />
              সাইন আউট
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Avatar({
  name,
  image,
  className = "h-8 w-8",
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      // Remote avatars come from the OAuth provider; a plain <img> keeps us
      // from having to allow-list every provider's CDN in next.config.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className={`${className} shrink-0 rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} grid shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700`}
    >
      {name}
    </span>
  );
}

/** Re-exported so pages can gate UI on auth state without another import. */
export { authClient };
