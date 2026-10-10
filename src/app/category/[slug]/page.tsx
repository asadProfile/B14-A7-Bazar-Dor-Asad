import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { ProductGrid } from "@/components/section-heading";
import { SortSelect } from "@/components/sort-select";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { bnNumber } from "@/lib/bn";
import { DEFAULT_SORT, isSortValue } from "@/lib/constants";
import type { Product } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "ক্যাটাগরি পাওয়া যায়নি" };

  return {
    title: `${category.nameBn} — আজকের দাম`,
    description: `${category.nameBn} ক্যাটাগরির সব পণ্যের আজকের বাজার দর, দাম কম-বেশি এবং বাজারভিত্তিক সর্বনিম্ন-সর্বোচ্চ দাম।`,
  };
}

/**
 * Sorts a product list by today's price.
 *
 * The comparison runs on the raw `today` number. Sorting the *formatted*
 * Bengali strings (`১৪৮`, `৯৯`, …) would order them by code point and put
 * `১৪৮` before `৯৯` — this is the trap C1 calls out.
 */
function sortProducts(products: Product[], sort: string): Product[] {
  if (sort === "price-asc") {
    return [...products].sort((a, b) => a.today - b.today);
  }
  if (sort === "price-desc") {
    return [...products].sort((a, b) => b.today - a.today);
  }
  return products;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, { sort }] = await Promise.all([params, searchParams]);
  const activeSort = isSortValue(sort) ? sort : DEFAULT_SORT;

  const category = await getCategoryBySlug(slug);

  // Unknown slug → the 404-style empty state with a route home.
  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState
          emoji="🔍"
          title="ক্যাটাগরি খুঁজে পাওয়া যায়নি"
          description={`“${decodeURIComponent(slug)}” নামে কোনো ক্যাটাগরি আমাদের তালিকায় নেই। বানান ঠিক আছে কিনা দেখুন, অথবা হোম পেজ থেকে যেকোনো ক্যাটাগরি বেছে নিন।`}
        />
      </div>
    );
  }

  const products = sortProducts(await getProductsByCategory(category.slug), activeSort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Title card */}
      <header className="card-surface flex items-center gap-4 px-5 py-5 sm:px-6">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl"
        >
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-[1.75rem]">
            {category.nameBn}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length > 0
              ? `${bnNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`
              : "এই ক্যাটাগরিতে এখনো কোনো পণ্য যোগ করা হয়নি"}
          </p>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="py-14">
          <EmptyState
            emoji="🧺"
            title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
            description="খালি ঝুড়ি! এই ক্যাটাগরিতে এই মুহূর্তে কোনো পণ্যের দাম যোগ করা নেই। অন্য ক্যাটাগরি দেখুন বা হোম পেজে ফিরে যান।"
          />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="card-surface mt-4 flex items-center justify-end px-4 py-3 sm:px-5">
            <Suspense
              fallback={<div className="skeleton h-9 w-56 rounded-lg" />}
            >
              <SortSelect value={activeSort} />
            </Suspense>
          </div>

          <p className="mt-5 text-sm text-muted" role="status">
            মোট {bnNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <ProductGrid className="mt-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </>
      )}
    </div>
  );
}
