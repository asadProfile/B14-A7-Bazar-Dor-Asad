import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";
import { socialProvidersEnabled } from "@/lib/auth";
import { getServerSession } from "@/lib/session";

export const metadata = {
  title: "সাইন ইন",
  description:
    "বিস্তারিত বাজার দর, বাজার তুলনা ও প্রোফাইল দেখতে আপনার বাজার দর অ্যাকাউন্টে সাইন ইন করুন।",
};

export default async function SignInPage() {
  // Already signed in? There is nothing to do on this route.
  const session = await getServerSession();
  if (session?.user) redirect("/");

  return (
    <AuthShell
      title="সাইন ইন"
      subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignInForm
          socialEnabled={{
            google: socialProvidersEnabled.google,
            github: socialProvidersEnabled.github,
          }}
        />
      </Suspense>
    </AuthShell>
  );
}
