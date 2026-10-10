import Image from "next/image";
import { ArrowDown } from "lucide-react";

import { bnDate } from "@/lib/bn";
import { ALL_PRODUCTS_ANCHOR } from "@/lib/constants";

/**
 * Home page banner.
 *
 * The CTA is an in-page anchor rather than a route change, so it scrolls down
 * to the "সব পণ্য" section on the same page.
 */
export function Hero({ productCount }: { productCount: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-linear-to-br from-white via-white to-brand-50 px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-brand-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {bnDate()}
            </span>

            <h1 className="mt-4 text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.5rem] lg:leading-[1.25]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন
              এক জায়গায়।
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`#${ALL_PRODUCTS_ANCHOR}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                সব পণ্য দেখুন
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className="text-[0.8125rem] text-muted">
                আজ {productCount.toLocaleString("bn-BD")}টি পণ্যের হালনাগাদ দর
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের টুকরিতে তাজা শাকসবজি ও ফল"
              width={315}
              height={263}
              priority
              sizes="(max-width: 1024px) 220px, 260px"
              className="h-auto w-[190px] drop-shadow-sm sm:w-[220px] lg:w-[260px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
