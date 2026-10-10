import Link from "next/link";
import { redirect } from "next/navigation";
import { PencilLine } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar } from "@/components/site-header";
import { bnDate } from "@/lib/bn";
import { getServerSession } from "@/lib/session";

export const metadata = {
  title: "আমার প্রোফাইল",
  description: "আপনার বাজার দর অ্যাকাউন্টের তথ্য দেখুন ও হালনাগাদ করুন।",
};

/** Protected route — reachable only with a valid session. */
export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/signin?next=%2Fprofile");

  const { name, email, image, createdAt } = session.user;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-[1.75rem]">আমার প্রোফাইল</h1>
      <p className="mt-1.5 text-sm text-muted">আপনার অ্যাকাউন্টের তথ্য দেখুন</p>

      {/* Identity card */}
      <section className="card-surface mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={name?.charAt(0) || "ব"} image={image} className="h-14 w-14 text-lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{name}</p>
            <p className="truncate text-sm text-muted">{email}</p>
            {createdAt ? (
              <p className="mt-1 text-xs text-muted">
                অ্যাকাউন্ট খোলা হয়েছে {bnDate(new Date(createdAt))}
              </p>
            ) : null}
          </div>
        </div>
        <SignOutButton />
      </section>

      {/* Account information — challenge requirement C3 */}
      <section className="card-surface mt-6 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">তথ্য</h2>
        <p className="mt-1 text-sm text-muted">
          আপনার নাম পরিবর্তন করতে চাইলে তথ্য হালনাগাদ করুন।
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
            <dt className="text-muted">নাম</dt>
            <dd className="font-semibold text-ink">{name}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted">ইমেইল</dt>
            <dd className="font-semibold text-ink">{email}</dd>
          </div>
        </dl>

        <Link
          href="/profile/update"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:w-auto"
        >
          <PencilLine className="h-4 w-4" aria-hidden="true" />
          তথ্য আপডেট করুন
        </Link>
      </section>
    </div>
  );
}
