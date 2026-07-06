import type {
  AssessmentAnswers,
  AssetAllocation,
  AssetClass,
  Constraint,
  GeographicExposure,
  Product,
  ProductRecommendation,
  RiskTolerance,
} from "../../types/domain";
import { ASSET_CLASSES } from "../../types/domain";
import { PRODUCT_CATALOG } from "../../data/products";
import { largestRemainder } from "./allocation";

const RISK_TARGET: Record<RiskTolerance, number> = {
  conservative: 2,
  moderate: 3,
  moderately_aggressive: 4,
  aggressive: 5,
};

function score(
  p: Product,
  constraints: Constraint[],
  riskTarget: number,
): number {
  let s = 0;
  if (
    constraints.includes("esg") &&
    (p.assetClass === "indian_equity" || p.assetClass === "intl_equity") &&
    p.tags.includes("esg")
  ) {
    s += 4;
  }
  if (
    constraints.includes("high_liquidity") &&
    (p.tags.includes("liquid") || p.type === "liquid_fund")
  ) {
    s += 3;
  }
  if (
    constraints.includes("tax_efficient") &&
    (p.tags.includes("tax_efficient") ||
      p.type === "index_fund" ||
      p.type === "etf")
  ) {
    s += 3;
  }
  if (constraints.includes("capital_protection")) {
    s += 5 - p.riskLevel;
  }
  s -= Math.abs(p.riskLevel - riskTarget);
  return s;
}

function rank(
  candidates: Product[],
  constraints: Constraint[],
  riskTarget: number,
): Product[] {
  return candidates
    .map((p, i) => ({ p, i, s: score(p, constraints, riskTarget) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.p);
}

const SPLITS: Record<number, number[]> = {
  1: [1],
  2: [0.6, 0.4],
  3: [0.5, 0.3, 0.2],
};

export function selectProducts(
  allocation: AssetAllocation,
  answers: AssessmentAnswers,
): ProductRecommendation[] {
  const riskTarget = RISK_TARGET[answers.riskTolerance];
  const raw: { product: Product; rawPct: number }[] = [];

  const pmsEligible =
    answers.amountCr >= 5 &&
    (answers.riskTolerance === "moderately_aggressive" ||
      answers.riskTolerance === "aggressive") &&
    !answers.constraints.includes("high_liquidity");

  for (const cls of ASSET_CLASSES) {
    let target = allocation[cls].target;
    if (target <= 0) continue;

    if (cls === "indian_equity" && pmsEligible) {
      const budget = target * 0.2;
      const ranked = rank(
        PRODUCT_CATALOG.filter((p) => p.type === "pms"),
        answers.constraints,
        riskTarget,
      );
      const chosen: { product: Product; rawPct: number }[] = [];
      const trySlots = (splits: number[]) => {
        chosen.length = 0;
        let ci = 0;
        for (const s of splits) {
          const pct = budget * s;
          const amt = (pct / 100) * answers.amountCr;
          while (
            ci < ranked.length &&
            (ranked[ci].minInvestmentCr ?? 0) > amt
          ) {
            ci++;
          }
          if (ci < ranked.length) {
            chosen.push({ product: ranked[ci], rawPct: pct });
            ci++;
          }
        }
      };
      trySlots(budget >= 10 ? [0.6, 0.4] : [1]);
      if (chosen.length === 0 && budget >= 10) trySlots([1]);
      for (const c of chosen) {
        raw.push(c);
        target -= c.rawPct;
      }
    }

    const picks = rank(
      PRODUCT_CATALOG.filter((p) => p.assetClass === cls && p.type !== "pms"),
      answers.constraints,
      riskTarget,
    );
    const n = Math.min(picks.length, target >= 25 ? 3 : target >= 10 ? 2 : 1);
    SPLITS[n].forEach((s, i) => {
      raw.push({ product: picks[i], rawPct: target * s });
    });
  }

  // exact sum to 100 in half-percent units
  const halves = largestRemainder(
    raw.map((r) => r.rawPct * 2),
    200,
  );
  return raw.map((r, i) => {
    const allocationPct = halves[i] / 2;
    return {
      product: r.product,
      allocationPct,
      amountCr: Math.round((allocationPct / 100) * answers.amountCr * 10) / 10,
    };
  });
}

export function getGeographicExposure(
  recs: ProductRecommendation[],
): GeographicExposure {
  const keys = ["india", "us", "europe", "asia", "others"] as const;
  const totals = keys.map((k) =>
    recs.reduce(
      (s, r) => s + (r.allocationPct * (r.product.geography[k] ?? 0)) / 100,
      0,
    ),
  );
  const rounded = largestRemainder(totals, 100);
  return {
    india: rounded[0],
    us: rounded[1],
    europe: rounded[2],
    asia: rounded[3],
    others: rounded[4],
  };
}
