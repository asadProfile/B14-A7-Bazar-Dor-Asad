/**
 * Bengali (বাংলা) formatting helpers.
 *
 * Every number shown in the UI goes through here so the whole app speaks
 * Bengali numerals consistently — including the sort logic, which must compare
 * numeric values rather than the localized strings.
 */

import type { PriceSummary, Product, TrendDir, Unit } from "./types";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

/** Converts every ASCII digit in a string to its Bengali counterpart. */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Formats a number using Bengali digits, keeping the Latin thousands
 * separator: `1850` → `১,৮৫০`, `72.5` → `৭২.৫`.
 */
export function bnNumber(value: number, maxFractionDigits = 2): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
  return toBnDigits(formatted);
}

/** `148` → `১৪৮ টাকা` */
export function bnTaka(value: number): string {
  return `${bnNumber(value)} টাকা`;
}

/** `-2.9` → `২.৯` (sign dropped — the ▲/▼ glyph carries the direction) */
export function bnPct(pct: number): string {
  return bnNumber(Math.abs(pct), 1);
}

const UNIT_LABELS: Record<Unit, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

/** `"kg"` → `প্রতি কেজি`. Unknown units fall through to per-piece. */
export function unitLabel(unit: string): string {
  return UNIT_LABELS[unit as Unit] ?? UNIT_LABELS.piece;
}

const UNIT_SHORT: Record<Unit, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

/** `"kg"` → `কেজি` — the compact form used inside the ticker strip. */
export function unitShort(unit: string): string {
  return UNIT_SHORT[unit as Unit] ?? UNIT_SHORT.piece;
}

const DIR_GLYPH: Record<TrendDir, string> = {
  up: "▲",
  down: "▼",
  flat: "—",
};

/** `{dir:"up",pct:2.1}` → `▲ ২.১%` */
export function changeLabel(dir: TrendDir, pct: number): string {
  return `${DIR_GLYPH[dir] ?? DIR_GLYPH.flat} ${bnPct(pct)}%`;
}

const BN_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
] as const;

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
] as const;

/**
 * Formats a date the way the navbar shows it:
 * `মঙ্গলবার, ৬ অক্টোবর, ২০২৬`.
 *
 * Built by hand rather than via `Intl` so the output is byte-identical on the
 * server and the client regardless of the runtime's ICU data.
 */
export function bnDate(date: Date = new Date()): string {
  const weekday = BN_WEEKDAYS[date.getDay()];
  const day = toBnDigits(date.getDate());
  const month = BN_MONTHS[date.getMonth()];
  const year = toBnDigits(date.getFullYear());
  return `${weekday}, ${day} ${month}, ${year}`;
}

/**
 * Bangla season greeting shown next to the date, e.g. `শীতকাল`.
 * Bangladesh follows the six-season (ষড়ঋতু) convention:
 * গ্রীষ্ম (Apr–May), বর্ষা (Jun–Jul), শরৎ (Aug–Sep), হেমন্ত (Oct–Nov),
 * শীত (Dec–Jan), বসন্ত (Feb–Mar).
 */
export function bnSeason(date: Date = new Date()): string {
  const m = date.getMonth() + 1; // 1-12
  if (m === 4 || m === 5) return "গ্রীষ্মকাল";
  if (m === 6 || m === 7) return "বর্ষাকাল";
  if (m === 8 || m === 9) return "শরৎকাল";
  if (m === 10 || m === 11) return "হেমন্তকাল";
  if (m === 12 || m === 1) return "শীতকাল";
  return "বসন্তকাল";
}

/**
 * Aggregates a product's per-market quotes into the min / max / average
 * summary card on the details page.
 *
 * Average is the mean of every market's min **and** max quote, rounded to two
 * decimals, which is what the Figma shows (e.g. `৬৩` for a ৫৯–৭১ spread).
 */
export function priceSummary(product: Product): PriceSummary {
  const markets = product.markets ?? [];
  if (markets.length === 0) {
    return {
      min: product.today,
      max: product.today,
      avg: product.today,
      minMarket: "",
      maxMarket: "",
    };
  }

  let lowest = markets[0];
  let highest = markets[0];
  let total = 0;

  for (const m of markets) {
    if (m.min < lowest.min) lowest = m;
    if (m.max > highest.max) highest = m;
    total += m.min + m.max;
  }

  return {
    min: lowest.min,
    max: highest.max,
    avg: Math.round((total / (markets.length * 2)) * 100) / 100,
    minMarket: lowest.market,
    maxMarket: highest.market,
  };
}

/** Human sentence describing today's move, used under the product title. */
export function priceMovementSentence(product: Product): string {
  const diff = Math.abs(product.today - product.yesterday);
  const amount = bnNumber(diff);
  if (product.change.dir === "flat" || diff === 0) {
    return "গতকালের তুলনায় আজ দাম অপরিবর্তিত।";
  }
  return product.change.dir === "up"
    ? `গতকালের তুলনায় আজ দাম বেড়েছে ${amount} টাকা।`
    : `গতকালের তুলনায় আজ দাম কমেছে ${amount} টাকা।`;
}
