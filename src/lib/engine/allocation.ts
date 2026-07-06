import type {
  AssessmentAnswers,
  AssetAllocation,
  AssetClass,
  Constraint,
  RiskTolerance,
} from "../../types/domain";
import { ASSET_CLASSES } from "../../types/domain";
import {
  applyConstraints,
  applyObjectiveTilt,
  BASE_ALLOCATION,
  equityCapFor,
  type AllocationVector,
} from "../../data/allocation-matrix";

/** Round `values` to integers (or any unit via pre-scaling) summing to `total` — largest remainder. */
export function largestRemainder(values: number[], total: number): number[] {
  const sum = values.reduce((a, b) => a + b, 0);
  const scaled = values.map((v) => (sum === 0 ? 0 : (v * total) / sum));
  const floors = scaled.map(Math.floor);
  let rem = total - floors.reduce((a, b) => a + b, 0);
  const order = scaled
    .map((_, i) => i)
    .sort((a, b) => scaled[b] - floors[b] - (scaled[a] - floors[a]));
  for (const i of order) {
    if (rem <= 0) break;
    floors[i]++;
    rem--;
  }
  return floors;
}

/** Integer rounding can nudge a constrained class by ±1; restore hard invariants. */
function fixInvariants(
  w: AllocationVector,
  constraints: Constraint[],
  risk: RiskTolerance,
): void {
  const international = constraints.includes("international");
  if (international) {
    while (w.intl_equity < 10) {
      const donor: AssetClass =
        w.indian_equity > 0 ? "indian_equity" : "indian_debt";
      w[donor]--;
      w.intl_equity++;
    }
  }
  if (constraints.includes("capital_protection")) {
    const cap = equityCapFor(risk);
    const intlFloor = international ? 10 : 0;
    let excess = w.indian_equity + w.intl_equity + w.alternatives - cap;
    while (excess > 0) {
      if (w.indian_equity > 0) w.indian_equity--;
      else if (w.alternatives > 0) w.alternatives--;
      else if (w.intl_equity > intlFloor) w.intl_equity--;
      else break;
      w.indian_debt++;
      excess--;
    }
  }
}

export function buildAllocation(answers: AssessmentAnswers): AssetAllocation {
  let w: AllocationVector = {
    ...BASE_ALLOCATION[answers.riskTolerance][answers.horizon],
  };
  w = applyObjectiveTilt(w, answers.objective);
  w = applyConstraints(w, answers.constraints, answers.riskTolerance);

  const rounded = largestRemainder(
    ASSET_CLASSES.map((c) => w[c]),
    100,
  );
  const final = {} as AllocationVector;
  ASSET_CLASSES.forEach((c, i) => {
    final[c] = rounded[i];
  });
  fixInvariants(final, answers.constraints, answers.riskTolerance);

  const allocation = {} as AssetAllocation;
  for (const c of ASSET_CLASSES) {
    const target = final[c];
    const min =
      c === "cash" && target > 0
        ? Math.max(2, target - 5)
        : Math.max(0, target - 5);
    allocation[c] = { target, min, max: target + 5 };
  }
  return allocation;
}
