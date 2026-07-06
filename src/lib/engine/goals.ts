import type {
  AssessmentAnswers,
  ClientProfile,
  GoalProjection,
  PortfolioMetrics,
} from "../../types/domain";

/** Abramowitz-Stegun 7.1.26 erf approximation → standard normal CDF. */
function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 +
          t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);
  return 0.5 * (1 + (z < 0 ? -erf : erf));
}

const round1 = (v: number) => Math.round(v * 10) / 10;

export function projectGoal(
  answers: AssessmentAnswers,
  metrics: PortfolioMetrics,
  profile: ClientProfile,
): GoalProjection {
  const r = metrics.expectedCagr / 100;
  const sigma = metrics.volatility / 100;
  const n = profile.horizonYears;
  const amount = answers.amountCr;

  const base = amount * Math.pow(1 + r, n);
  const conservative = amount * Math.pow(1 + r - sigma / Math.sqrt(n), n);
  const optimistic = amount * Math.pow(1 + r + sigma / Math.sqrt(n), n);

  const shortish = profile.horizon === "short" || profile.horizon === "medium";
  const target = shortish ? amount * 1.5 : amount * Math.pow(1.1, n);

  const z =
    (n * Math.log(1 + r) - Math.log(target / amount)) /
    (sigma * Math.sqrt(n));
  const probability = Math.min(
    99,
    Math.max(1, Math.round(normalCdf(z) * 100)),
  );

  return {
    years: n,
    expectedCorpusCr: round1(base),
    scenarios: {
      conservative: round1(conservative),
      base: round1(base),
      optimistic: round1(optimistic),
    },
    probabilityOfSuccess: probability,
    targetCorpusCr: round1(target),
  };
}
