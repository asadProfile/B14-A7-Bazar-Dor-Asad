import { ProductGridSkeleton } from "@/components/skeletons";

/** Route-level fallback shown while the home page's product fetch resolves. */
export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="skeleton h-[15rem] rounded-2xl sm:h-[17rem]" />
      <div className="py-10 sm:py-12">
        <div className="skeleton mb-4 h-7 w-56" />
        <ProductGridSkeleton count={6} label="আজকের দাম পরিবর্তন লোড হচ্ছে…" />
      </div>
    </div>
  );
}
