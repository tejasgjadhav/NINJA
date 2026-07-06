/* Sanity harness for the NINJA domain engine. Run: npx tsx scripts/engine-sanity.ts */
import type {
  AssessmentAnswers,
  Constraint,
  Horizon,
  Objective,
  RiskTolerance,
} from "../src/types/domain";
import { ASSET_CLASSES } from "../src/types/domain";
import { buildProfile } from "../src/lib/engine/profile";
import { buildAllocation } from "../src/lib/engine/allocation";
import { buildIPS } from "../src/lib/engine/ips";
import { selectProducts, getGeographicExposure } from "../src/lib/engine/products";
import { computeMetrics } from "../src/lib/engine/metrics";
import { simulateDrift } from "../src/lib/engine/drift";
import { projectGoal } from "../src/lib/engine/goals";
import { generateInsights } from "../src/lib/engine/insights";
import { draftReviewLetter } from "../src/lib/engine/review-letter";

const RISKS: RiskTolerance[] = [
  "conservative",
  "moderate",
  "moderately_aggressive",
  "aggressive",
];
const HORIZONS: Horizon[] = ["short", "medium", "long", "very_long"];
const OBJECTIVES: Objective[] = [
  "capital_appreciation",
  "wealth_preservation",
  "income_generation",
  "liability_matching",
  "inflation_protection",
];
const CONSTRAINT_SETS: Constraint[][] = [
  ["none"],
  ["capital_protection", "high_liquidity"],
  ["international", "esg"],
  ["tax_efficient", "sector_restrictions"],
  ["international", "capital_protection", "high_liquidity"],
];

let combos = 0;
function assert(cond: boolean, msg: string, ctx: AssessmentAnswers): void {
  if (!cond) {
    console.error(`FAIL: ${msg}\ncontext: ${JSON.stringify(ctx)}`);
    process.exit(1);
  }
}

for (const riskTolerance of RISKS) {
  for (const horizon of HORIZONS) {
    for (const objective of OBJECTIVES) {
      for (const constraints of CONSTRAINT_SETS) {
        for (const amountCr of [5, 50]) {
          const answers: AssessmentAnswers = {
            investorType: "family_office",
            objective,
            horizon,
            riskTolerance,
            amountCr,
            constraints,
            completedAt: "2026-07-01T00:00:00.000Z",
            version: 1,
          };
          combos++;

          // allocation
          const allocation = buildAllocation(answers);
          const targets = ASSET_CLASSES.map((c) => allocation[c].target);
          assert(
            targets.reduce((a, b) => a + b, 0) === 100,
            `targets sum ${targets.reduce((a, b) => a + b, 0)} !== 100`,
            answers,
          );
          assert(
            targets.every((t) => t >= 0 && Number.isInteger(t)),
            "negative or non-integer target",
            answers,
          );
          for (const c of ASSET_CLASSES) {
            const b = allocation[c];
            assert(b.min <= b.max, `band inverted for ${c}`, answers);
          }

          if (constraints.includes("capital_protection")) {
            const cap =
              riskTolerance === "conservative" || riskTolerance === "moderate"
                ? 25
                : 35;
            const eq =
              allocation.indian_equity.target +
              allocation.intl_equity.target +
              allocation.alternatives.target;
            assert(eq <= cap, `equity+alts ${eq} > cap ${cap}`, answers);
          }
          if (constraints.includes("international")) {
            assert(
              allocation.intl_equity.target >= 10,
              `intl_equity ${allocation.intl_equity.target} < 10`,
              answers,
            );
          }

          // products
          const recs = selectProducts(allocation, answers);
          const pctSum = recs.reduce((s, r) => s + r.allocationPct, 0);
          assert(
            Math.abs(pctSum - 100) < 1e-9,
            `product pcts sum ${pctSum} !== 100`,
            answers,
          );
          assert(
            recs.every((r) => r.allocationPct > 0 && r.amountCr >= 0),
            "non-positive product allocation",
            answers,
          );

          const geo = getGeographicExposure(recs);
          const geoSum = geo.india + geo.us + geo.europe + geo.asia + geo.others;
          assert(geoSum === 100, `geo sum ${geoSum} !== 100`, answers);

          // metrics
          const metrics = computeMetrics(allocation);
          assert(
            [
              metrics.expectedCagr,
              metrics.volatility,
              metrics.sharpe,
              metrics.maxDrawdownEst,
              metrics.riskScore,
            ].every(Number.isFinite),
            "non-finite metric",
            answers,
          );
          assert(
            metrics.riskScore >= 1 && metrics.riskScore <= 100,
            `riskScore ${metrics.riskScore} out of range`,
            answers,
          );

          // drift determinism + integrity
          const d1 = simulateDrift(allocation, answers);
          const d2 = simulateDrift(allocation, answers);
          assert(
            JSON.stringify(d1) === JSON.stringify(d2),
            "drift not deterministic",
            answers,
          );
          const curSum = d1.items.reduce((s, i) => s + i.currentPct, 0);
          assert(curSum === 100, `drift currents sum ${curSum} !== 100`, answers);

          // goals
          const profile = buildProfile(answers);
          const goal = projectGoal(answers, metrics, profile);
          assert(
            goal.probabilityOfSuccess >= 1 && goal.probabilityOfSuccess <= 99,
            `probability ${goal.probabilityOfSuccess} out of [1,99]`,
            answers,
          );
          assert(
            goal.scenarios.conservative <= goal.scenarios.base &&
              goal.scenarios.base <= goal.scenarios.optimistic,
            "scenario ordering broken",
            answers,
          );

          // ips / insights / letter shape checks
          const ips = buildIPS(answers);
          assert(ips.generatedAt === answers.completedAt, "generatedAt mismatch", answers);
          assert(ips.constraintsNarrative.length >= 1, "empty constraints narrative", answers);

          const insights = generateInsights({ profile, allocation, metrics, drift: d1, geo });
          assert(
            insights.length >= 3 && insights.length <= 7,
            `insights count ${insights.length} out of range`,
            answers,
          );
          assert(
            new Set(insights.map((i) => i.id)).size === insights.length,
            "duplicate insight ids",
            answers,
          );

          const letter = draftReviewLetter({ profile, ips, metrics, drift: d1 });
          assert(
            letter.paragraphs.length >= 6 && letter.paragraphs.length <= 8,
            `letter paragraphs ${letter.paragraphs.length} out of range`,
            answers,
          );
          assert(
            letter.subject.startsWith("Quarterly Portfolio Review"),
            "bad letter subject",
            answers,
          );
        }
      }
    }
  }
}

console.log(`ALL CHECKS PASSED (${combos} combos)`);
