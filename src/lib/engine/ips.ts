import type {
  AssessmentAnswers,
  Constraint,
  IPS,
  Objective,
} from "../../types/domain";
import { buildProfile } from "./profile";
import { buildAllocation } from "./allocation";
import { computeMetrics } from "./metrics";

const OBJECTIVE_SENTENCES: Record<Objective, string> = {
  capital_appreciation:
    "The primary objective is long-term capital appreciation, accepting interim volatility in pursuit of superior real returns.",
  wealth_preservation:
    "The primary objective is preservation of capital in real terms, prioritising drawdown control over return maximisation.",
  income_generation:
    "The primary objective is the generation of a stable, recurring income stream from yield-oriented assets.",
  liability_matching:
    "The primary objective is to match projected liabilities with high-certainty cash flows and duration-aligned assets.",
  inflation_protection:
    "The primary objective is protection of purchasing power through real assets and inflation-sensitive exposures.",
};

const CONSTRAINT_LINES: Record<Exclude<Constraint, "none">, string> = {
  international:
    "International diversification is mandated: overseas equity is held within a 10–25% policy band.",
  esg: "ESG exclusionary screening applies to all listed-equity selections in the portfolio.",
  high_liquidity:
    "A minimum 8% allocation to cash and overnight instruments is maintained; illiquid alternatives are excluded.",
  tax_efficient:
    "Product selection favours tax-efficient vehicles, including index funds, ETFs and target-maturity structures.",
  sector_restrictions:
    "Client-specified sector restrictions apply and are screened at the individual product level.",
  capital_protection:
    "A capital-protection overlay caps growth assets and channels the balance into high-grade fixed income.",
};

function benchmarkFor(equityPct: number): string {
  if (equityPct >= 60) return "75% NIFTY 500 / 25% CRISIL Composite Bond";
  if (equityPct >= 40) return "60% NIFTY 500 / 40% CRISIL Composite Bond";
  if (equityPct >= 20) return "40% NIFTY 500 / 60% CRISIL Composite Bond";
  return "20% NIFTY 500 / 80% CRISIL Composite Bond";
}

export function buildIPS(answers: AssessmentAnswers): IPS {
  const profile = buildProfile(answers);
  const allocation = buildAllocation(answers);
  const metrics = computeMetrics(allocation);

  const equityPct =
    allocation.indian_equity.target + allocation.intl_equity.target;

  const objectivesNarrative = [
    `This Investment Policy Statement governs a ${profile.investorLabel.toLowerCase()} mandate of ₹${profile.amountCr.toLocaleString("en-IN")} crore with an investment horizon of ${profile.horizonLabel}.`,
    OBJECTIVE_SENTENCES[profile.objective],
    `Portfolio construction reflects a ${profile.riskToleranceLabel.toLowerCase()} risk tolerance and ${profile.riskCapacity} risk capacity derived from the investor's structure and horizon.`,
  ].join(" ");

  const liquidityNeeds = answers.constraints.includes("high_liquidity")
    ? "Elevated liquidity requirement: a minimum 8% of the portfolio is held in cash and overnight instruments, with the balance in daily-liquidity vehicles wherever practicable."
    : answers.investorType === "corporate_treasury"
      ? "Moderate liquidity requirement: treasury operations may draw on the portfolio at short notice, so a working cash buffer and short-duration debt sleeve are maintained."
      : "Low expected liquidity draw: distributions and redemptions are anticipated to be infrequent, permitting fuller deployment into longer-duration and growth assets.";

  const selected = answers.constraints.filter(
    (c): c is Exclude<Constraint, "none"> => c !== "none",
  );
  const constraintsNarrative =
    selected.length > 0
      ? selected.map((c) => CONSTRAINT_LINES[c])
      : [
          "No client-specific constraints apply; the standard institutional investment universe is available to the mandate.",
        ];

  const reviewFrequency: IPS["reviewFrequency"] =
    answers.horizon === "very_long" && answers.riskTolerance === "conservative"
      ? "Semi-annual"
      : "Quarterly";

  return {
    profile,
    objectivesNarrative,
    returnExpectation: {
      targetCagr: metrics.expectedCagr,
      benchmark: benchmarkFor(equityPct),
    },
    riskProfile: {
      tolerance: profile.riskTolerance,
      toleranceLabel: profile.riskToleranceLabel,
      capacity: profile.riskCapacity,
      maxDrawdownTolerance: metrics.maxDrawdownEst,
    },
    liquidityNeeds,
    allocation,
    constraintsNarrative,
    reviewFrequency,
    rebalancing: {
      corridorPct: 5,
      method:
        "Corridor-based; rebalance any asset class breaching its policy band, review quarterly",
    },
    generatedAt: answers.completedAt,
  };
}
