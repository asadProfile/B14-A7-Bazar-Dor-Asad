/** Shared domain types for the BazarDor API. */

export type Unit = "kg" | "litre" | "dozen" | "piece";

export type TrendDir = "up" | "down" | "flat";

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface MarketPrice {
  /** Bazar name, e.g. "কারওয়ান বাজার" */
  market: string;
  /** Division name, e.g. "ঢাকা" */
  division: string;
  /** Lowest price quoted in that bazar */
  min: number;
  /** Highest price quoted in that bazar */
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: Unit;
  /** Emoji used as the product illustration */
  image: string;
  /** Today's reference price (in টাকা) */
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: TrendDir;
    /** Signed percentage vs. yesterday, e.g. 2.1 or -2.9 */
    pct: number;
  };
  markets: MarketPrice[];
}

/** Aggregated min / max / average price for a single product. */
export interface PriceSummary {
  min: number;
  max: number;
  /** Rounded to 2 decimals — the mean of every market's min & max quote */
  avg: number;
  minMarket: string;
  maxMarket: string;
}
