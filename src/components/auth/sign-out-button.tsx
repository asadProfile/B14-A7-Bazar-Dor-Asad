"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

import { signOut } from "@/lib/auth-client";

/** Outlined sign-out control used on the profile page. */
export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    const loadingId = toast.loading("সাইন আউট করা হচ্ছে…");
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।", { id: loadingId });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।", { id: loadingId });
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-up/30 px-4 py-2.5 text-sm font-semibold text-up transition-colors hover:bg-up-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {pending ? "অপেক্ষা করুন…" : "সাইন আউট"}
    </button>
  );
}
