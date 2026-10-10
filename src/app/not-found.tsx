import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "পেজ পাওয়া যায়নি",
  description: "আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।",
};

/**
 * Catch-all 404 for unknown routes — `/category/invalid`, `/product/unknown`
 * and anything else that does not match.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="mb-6 text-center text-6xl font-bold tracking-tight text-brand-100 sm:text-7xl">
        ৪০৪
      </p>
      <EmptyState
        emoji="🧭"
        title="পেজটি খুঁজে পাওয়া যায়নি"
        description="আপনি যে পেজটি খুঁজছেন সেটি নেই, নাম বদলে গেছে, অথবা লিংকটি ভুল। নিচের বোতাম থেকে হোম পেজে ফিরে গিয়ে আবার চেষ্টা করুন।"
      />
    </div>
  );
}
