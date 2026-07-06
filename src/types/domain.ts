export type InvestorType =
  | "corporate_treasury"
  | "trust"
  | "family_office"
  | "endowment"
  | "foundation"
  | "pension_fund"
  | "hni"
  | "institutional";

export type Objective =
  | "capital_appreciation"
  | "wealth_preservation"
  | "income_generation"
  | "liability_matching"
  | "inflation_protection";

/** <3y / 3–5y / 5–10y / 10+y */
export type Horizon = "short" | "medium" | "long" | "very_long";

export type RiskTolerance =
  | "conservative"
  | "moderate"
  | "moderately_aggressive"
  | "aggressive";

export type Constraint =
  | "international"
  | "esg"
  | "high_liquidity"
  | "tax_efficient"
  | "sector_restrictions"
  | "capital_protection"
  | "none";

export interface AssessmentAnswers {
  investorType: InvestorType;
  objective: Objective;
  horizon: Horizon;
  riskTolerance: RiskTolerance;
  /** Investment amount in ₹ crore */
  amountCr: number;
  constraints: Constraint[];
  /** ISO timestamp fixed at completion time (never regenerated at render) */
  completedAt: string;
  version: 1;
}

export type AssetClass =
  | "indian_equity"
  | "intl_equity"
  | "indian_debt"
  | "gold"
  | "reits_invits"
  | "alternatives"
  | "cash";

/** Integer percentages; targets across classes sum to exactly 100 */
export interface AllocationBand {
  target: number;
  min: number;
  max: number;
}

export type AssetAllocation = Record<AssetClass, AllocationBand>;

export interface ClientProfile {
  investorType: InvestorType;
  investorLabel: string;
  objective: Objective;
  objectiveLabel: string;
  horizon: Horizon;
  horizonLabel: string;
  /** midpoint years: 2 / 4 / 7 / 15 */
  horizonYears: number;
  riskTolerance: RiskTolerance;
  riskToleranceLabel: string;
  /** derived from investor type + horizon */
  riskCapacity: "low" | "medium" | "high";
  amountCr: number;
  constraints: Constraint[];
}

export interface IPS {
  profile: ClientProfile;
  objectivesNarrative: string;
  returnExpectation: { targetCagr: number; benchmark: string };
  riskProfile: {
    tolerance: RiskTolerance;
    toleranceLabel: string;
    capacity: string;
    maxDrawdownTolerance: number;
  };
  liquidityNeeds: string;
  allocation: AssetAllocation;
  constraintsNarrative: string[];
  reviewFrequency: "Quarterly" | "Semi-annual";
  rebalancing: { corridorPct: number; method: string };
  generatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  type: "mutual_fund" | "etf" | "pms" | "liquid_fund" | "index_fund";
  assetClass: AssetClass;
  /** e.g. "Flexi Cap", "Gilt", "International FoF" */
  category: string;
  /** AMC or PMS manager */
  manager: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  thesis: string;
  role: string;
  /** percentages summing to 100 */
  geography: Partial<Record<"india" | "us" | "europe" | "asia" | "others", number>>;
  tags: Array<"esg" | "liquid" | "tax_efficient" | "capital_protection">;
  /** PMS minimum ticket in ₹ crore */
  minInvestmentCr?: number;
}

export interface ProductRecommendation {
  product: Product;
  allocationPct: number;
  amountCr: number;
}

export interface PortfolioMetrics {
  /** all percentages */
  expectedCagr: number;
  volatility: number;
  sharpe: number;
  maxDrawdownEst: number;
  /** 1–100 */
  riskScore: number;
}

export interface GeographicExposure {
  india: number;
  us: number;
  europe: number;
  asia: number;
  others: number;
}

export interface DriftItem {
  assetClass: AssetClass;
  targetPct: number;
  currentPct: number;
  deviation: number;
  breach: boolean;
  /** e.g. "Trim ₹18.4 Cr" */
  action?: string;
}

export interface DriftReport {
  items: DriftItem[];
  rebalanceNeeded: boolean;
  maxDeviation: number;
}

export interface GoalProjection {
  years: number;
  expectedCorpusCr: number;
  scenarios: { conservative: number; base: number; optimistic: number };
  /** 0–100, probability corpus meets the implied goal */
  probabilityOfSuccess: number;
  /** implied goal corpus in ₹ crore */
  targetCorpusCr: number;
}

export interface Insight {
  id: string;
  severity: "info" | "positive" | "watch";
  title: string;
  body: string;
}

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  indian_equity: "Indian Equity",
  intl_equity: "International Equity",
  indian_debt: "Indian Debt",
  gold: "Gold",
  reits_invits: "REITs & InvITs",
  alternatives: "Alternatives",
  cash: "Cash & Liquid",
};

export const ASSET_CLASSES: AssetClass[] = [
  "indian_equity",
  "intl_equity",
  "indian_debt",
  "gold",
  "reits_invits",
  "alternatives",
  "cash",
];
