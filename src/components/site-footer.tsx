import { BrandMark } from "./brand";

/** Footer from the Figma: brand line on the left, price disclaimer on the right. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <BrandMark size="sm" />
          <p className="text-sm text-muted">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>
        <p className="max-w-md text-sm text-muted italic">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
