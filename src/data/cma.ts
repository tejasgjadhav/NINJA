import type { AssetClass } from "../types/domain";
import { ASSET_CLASSES } from "../types/domain";

/** annual, % */
export const RISK_FREE_PCT = 6.5;

export const CMA: Record<
  AssetClass,
  { expectedReturnPct: number; volatilityPct: number }
> = {
  indian_equity: { expectedReturnPct: 12, volatilityPct: 16 },
  intl_equity: { expectedReturnPct: 10, volatilityPct: 15 },
  indian_debt: { expectedReturnPct: 7, volatilityPct: 3 },
  gold: { expectedReturnPct: 8, volatilityPct: 14 },
  reits_invits: { expectedReturnPct: 9, volatilityPct: 12 },
  alternatives: { expectedReturnPct: 11, volatilityPct: 18 },
  cash: { expectedReturnPct: 6, volatilityPct: 0.5 },
};

/** Symmetric 7×7 correlation matrix, row/column order = ASSET_CLASSES. */
export const CORRELATION: number[][] = [
  // in_eq intl  debt  gold  reit  alts  cash
  [1.0, 0.7, 0.1, -0.1, 0.55, 0.6, 0.0], // indian_equity
  [0.7, 1.0, 0.05, -0.05, 0.45, 0.55, 0.0], // intl_equity
  [0.1, 0.05, 1.0, 0.15, 0.3, 0.1, 0.3], // indian_debt
  [-0.1, -0.05, 0.15, 1.0, 0.05, 0.05, 0.05], // gold
  [0.55, 0.45, 0.3, 0.05, 1.0, 0.4, 0.05], // reits_invits
  [0.6, 0.55, 0.1, 0.05, 0.4, 1.0, 0.05], // alternatives
  [0.0, 0.0, 0.3, 0.05, 0.05, 0.05, 1.0], // cash
];

export const CMA_ORDER: AssetClass[] = ASSET_CLASSES;
