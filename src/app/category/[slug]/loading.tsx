import { ProductGridSkeleton } from "@/components/skeletons";

/** Shown while the category's product list is being fetched. */
export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="card-surface flex items-center gap-4 px-5 py-5 sm:px-6">
        <div className="skeleton h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-7 w-28" />
          <div className="skeleton h-4 w-56" />
        </div>
      </div>

      <div className="card-surface mt-4 flex justify-end px-4 py-3 sm:px-5">
        <div className="skeleton h-9 w-56 rounded-lg" />
      </div>

      <div className="mt-5 skeleton h-4 w-48" />

      <div className="mt-4">
        <ProductGridSkeleton count={4} label="ক্যাটাগরির পণ্য লোড হচ্ছে…" />
      </div>
    </div>
  );
}
