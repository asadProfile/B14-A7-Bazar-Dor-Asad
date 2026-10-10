import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";
import { socialProvidersEnabled } from "@/lib/auth";
import { getServerSession } from "@/lib/session";

export const metadata = {
  title: "সাইন আপ",
  description:
    "বিনা খরচে বাজার দর অ্যাকাউন্ট খুলুন — সব পণ্যের বাজারভিত্তিক বিস্তারিত দাম দেখুন।",
};

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session?.user) redirect("/");

  return (
    <AuthShell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignUpForm
          socialEnabled={{
            google: socialProvidersEnabled.google,
            github: socialProvidersEnabled.github,
          }}
        />
      </Suspense>
    </AuthShell>
  );
}
