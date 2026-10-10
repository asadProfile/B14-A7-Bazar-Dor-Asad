import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { UpdateNameForm } from "@/components/auth/update-name-form";
import { getServerSession } from "@/lib/session";

export const metadata = {
  title: "তথ্য আপডেট",
  description: "আপনার বাজার দর অ্যাকাউন্টের নাম হালনাগাদ করুন।",
};

/**
 * Challenge requirement C3 — the "update information" route the profile page
 * links to. Writes through BetterAuth's `updateUser` API.
 */
export default async function UpdateProfilePage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/signin?next=%2Fprofile%2Fupdate");

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        প্রোফাইলে ফিরে যান
      </Link>

      <h1 className="mt-5 text-2xl font-bold text-ink sm:text-[1.75rem]">
        তথ্য আপডেট করুন
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        আপনার নাম পরিবর্তন করে আপডেট বাটনে ক্লিক করুন।
      </p>

      <div className="card-surface mt-6 p-5 sm:p-6">
        <UpdateNameForm
          initialName={session.user.name}
          email={session.user.email}
        />
      </div>
    </div>
  );
}
