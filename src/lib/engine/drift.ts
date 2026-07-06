import type {
  AssessmentAnswers,
  AssetAllocation,
  DriftItem,
  DriftReport,
} from "../../types/domain";
import { ASSET_CLASSES } from "../../types/domain";
import { hashString, mulberry32 } from "../seeded-random";
import { formatCrore } from "../format";
import { CMA } from "../../data/cma";
import { largestRemainder } from "./allocation";

export function simulateDrift(
  allocation: AssetAllocation,
  answers: AssessmentAnswers,
): DriftReport {
  const rng = mulberry32(hashString(JSON.stringify(answers)));

  const currentsRaw = ASSET_CLASSES.map((c) => {
    const target = allocation[c].target;
    // offset in [-7, +7] scaled by class volatility relative to equity (16%)
    const offset = (rng() * 14 - 7) * (CMA[c].volatilityPct / 16);
    return target > 0 ? Math.max(0, target + offset) : 0;
  });
  const currents = largestRemainder(currentsRaw, 100);

  const items: DriftItem[] = ASSET_CLASSES.map((c, i) => {
    const targetPct = allocation[c].target;
    const currentPct = currents[i];
    const deviation = currentPct - targetPct;
    const breach = Math.abs(deviation) > 5;
    const item: DriftItem = { assetClass: c, targetPct, currentPct, deviation, breach };
    if (breach) {
      const amt = formatCrore((Math.abs(deviation) / 100) * answers.amountCr, 1);
      item.action = deviation > 0 ? `Trim ${amt}` : `Add ${amt}`;
    }
    return item;
  });

  return {
    items,
    rebalanceNeeded: items.some((i) => i.breach),
    maxDeviation: Math.max(...items.map((i) => Math.abs(i.deviation))),
  };
}
