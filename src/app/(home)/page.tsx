import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ProductGrid, SectionHeading } from "@/components/section-heading";
import { getProducts, splitMovers } from "@/lib/api";
import { bnNumber } from "@/lib/bn";
import { ALL_PRODUCTS_ANCHOR, MOVERS_LIMIT } from "@/lib/constants";

export const metadata = {
  title: "আজকের বাজারের দাম এক নজরে",
  description:
    "নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজার দর, বাজারভিত্তিক সর্বনিম্ন-সর্বোচ্চ দাম এবং দাম বাড়া-কমার ধারা এক নজরে দেখুন।",
};

export default async function HomePage() {
  const products = await getProducts();
  const { risers, fallers } = splitMovers(products, MOVERS_LIMIT);

  return (
    <>
      <Hero productCount={products.length} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {/* ---------- Section A — আজ দাম বেড়েছে ---------- */}
        {risers.length > 0 ? (
          <section aria-labelledby="risers-heading">
            <SectionHeading
              glyph="▲"
              glyphClassName="text-up text-lg"
              title="আজ দাম বেড়েছে"
              subtitle={`গতকালের তুলনায় সবচেয়ে বেশি দাম বেড়েছে এই ${bnNumber(risers.length)}টি পণ্যের`}
            />
            <h2 id="risers-heading" className="sr-only">
              আজ দাম বেড়েছে
            </h2>
            <ProductGrid>
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </section>
        ) : null}

        {/* ---------- Section B — আজ দাম কমেছে ---------- */}
        {fallers.length > 0 ? (
          <section aria-labelledby="fallers-heading" className="mt-12 sm:mt-14">
            <SectionHeading
              glyph="▼"
              glyphClassName="text-down text-lg"
              title="আজ দাম কমেছে"
              subtitle={`গতকালের তুলনায় সবচেয়ে বেশি দাম কমেছে এই ${bnNumber(fallers.length)}টি পণ্যের`}
            />
            <h2 id="fallers-heading" className="sr-only">
              আজ দাম কমেছে
            </h2>
            <ProductGrid>
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </section>
        ) : null}

        {/* ---------- Section C — সব পণ্য (the hero CTA anchors here) ---------- */}
        <section
          id={ALL_PRODUCTS_ANCHOR}
          aria-labelledby="all-products-heading"
          className="mt-12 scroll-mt-44 sm:mt-16"
        >
          <SectionHeading
            title="সব পণ্য"
            subtitle={`মোট ${bnNumber(products.length)}টি পণ্যের আজকের বাজার দর — যেকোনো পণ্যে ক্লিক করে বাজারভিত্তিক বিস্তারিত দেখুন।`}
          />
          <h2 id="all-products-heading" className="sr-only">
            সব পণ্য
          </h2>
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </section>
      </div>
    </>
  );
}
