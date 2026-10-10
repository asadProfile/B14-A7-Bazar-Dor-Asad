import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";

import { PriceTicker } from "@/components/price-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AppToaster } from "@/components/app-toaster";
import { getCategories, getProducts } from "@/lib/api";
import { bnDate } from "@/lib/bn";

import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।",
  keywords: [
    "বাজার দর",
    "BazarDor",
    "নিত্যপ্রয়োজনীয় পণ্যের দাম",
    "সবজির দাম",
    "মাছের দাম",
  ],
};

export const viewport: Viewport = {
  themeColor: "#05893e",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader categories={categories} serverDate={bnDate()} />
        <PriceTicker products={products} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AppToaster />
      </body>
    </html>
  );
}
