import type {
  AssetClass,
  Constraint,
  Horizon,
  Objective,
  RiskTolerance,
} from "../types/domain";
import { ASSET_CLASSES } from "../types/domain";

export type AllocationVector = Record<AssetClass, number>;

/** order: indian_equity / intl_equity / indian_debt / gold / reits_invits / alternatives / cash */
function vec(w: number[]): AllocationVector {
  const out = {} as AllocationVector;
  ASSET_CLASSES.forEach((c, i) => {
    out[c] = w[i];
  });
  return out;
}

export const BASE_ALLOCATION: Record<
  RiskTolerance,
  Record<Horizon, AllocationVector>
> = {
  conservative: {
    short: vec([10, 0, 65, 5, 5, 0, 15]),
    medium: vec([15, 0, 60, 5, 8, 0, 12]),
    long: vec([20, 5, 55, 5, 8, 0, 7]),
    very_long: vec([25, 5, 50, 8, 7, 0, 5]),
  },
  moderate: {
    short: vec([20, 5, 55, 5, 8, 0, 7]),
    medium: vec([30, 5, 45, 8, 7, 0, 5]),
    long: vec([35, 10, 35, 8, 7, 0, 5]),
    very_long: vec([40, 10, 30, 8, 7, 0, 5]),
  },
  moderately_aggressive: {
    short: vec([30, 5, 45, 8, 7, 0, 5]),
    medium: vec([40, 10, 32, 8, 5, 0, 5]),
    long: vec([45, 12, 25, 6, 5, 4, 3]),
    very_long: vec([50, 12, 20, 6, 5, 4, 3]),
  },
  aggressive: {
    short: vec([35, 10, 38, 6, 5, 3, 3]),
    medium: vec([45, 12, 25, 6, 5, 4, 3]),
    long: vec([52, 15, 15, 5, 5, 5, 3]),
    very_long: vec([55, 18, 10, 5, 4, 5, 3]),
  },
};

/** Additive objective tilt; every class clamped at 0. */
export function applyObjectiveTilt(
  w: AllocationVector,
  objective: Objective,
): AllocationVector {
  const out = { ...w };
  const add = (c: AssetClass, d: number) => {
    out[c] = Math.max(0, out[c] + d);
  };
  // reduce total equity, taking from indian first then intl
  const cutEquity = (amt: number) => {
    const fromIndian = Math.min(amt, out.indian_equity);
    out.indian_equity -= fromIndian;
    out.intl_equity = Math.max(0, out.intl_equity - (amt - fromIndian));
  };
  switch (objective) {
    case "capital_appreciation":
      add("indian_equity", 5);
      add("indian_debt", -5);
      break;
    case "wealth_preservation":
      cutEquity(5);
      add("indian_debt", 3);
      add("gold", 2);
      break;
    case "income_generation":
      add("indian_debt", 7);
      add("reits_invits", 5);
      add("indian_equity", -10);
      add("intl_equity", -2);
      break;
    case "liability_matching":
      add("indian_debt", 10);
      add("cash", 3);
      cutEquity(10);
      add("gold", -3);
      break;
    case "inflation_protection":
      add("gold", 5);
      add("indian_equity", 3);
      add("reits_invits", 2);
      add("indian_debt", -10);
      break;
  }
  return out;
}

export function equityCapFor(risk: RiskTolerance): number {
  return risk === "conservative" || risk === "moderate" ? 25 : 35;
}

/** Fixed transform order: capital_protection → high_liquidity → international. */
export function applyConstraints(
  w: AllocationVector,
  constraints: Constraint[],
  risk: RiskTolerance,
): AllocationVector {
  const out = { ...w };

  if (constraints.includes("capital_protection")) {
    const cap = equityCapFor(risk);
    const keys: AssetClass[] = ["indian_equity", "intl_equity", "alternatives"];
    const eq = keys.reduce((s, k) => s + out[k], 0);
    if (eq > cap) {
      // proportional integer reduction within the equity group (largest remainder)
      const scaled = keys.map((k) => (out[k] * cap) / eq);
      const floors = scaled.map(Math.floor);
      let rem = cap - floors.reduce((a, b) => a + b, 0);
      const order = keys
        .map((_, i) => i)
        .sort((a, b) => scaled[b] - floors[b] - (scaled[a] - floors[a]));
      for (const i of order) {
        if (rem <= 0) break;
        floors[i]++;
        rem--;
      }
      keys.forEach((k, i) => {
        out[k] = floors[i];
      });
      out.indian_debt += eq - cap;
    }
  }

  if (constraints.includes("high_liquidity")) {
    let pool = out.alternatives;
    out.alternatives = 0;
    const needed = Math.max(0, 8 - out.cash);
    if (pool < needed) {
      const extra = Math.min(needed - pool, out.reits_invits);
      out.reits_invits -= extra;
      pool += extra;
    }
    const toCash = Math.min(needed, pool);
    out.cash += toCash;
    out.indian_debt += pool - toCash;
  }

  if (constraints.includes("international")) {
    const target = Math.min(25, Math.max(10, out.intl_equity));
    let delta = target - out.intl_equity;
    if (delta > 0) {
      const fromIndian = Math.min(delta, out.indian_equity);
      out.indian_equity -= fromIndian;
      out.intl_equity += fromIndian;
      delta -= fromIndian;
      // fallback funding when indian equity is exhausted
      const fromDebt = Math.min(delta, out.indian_debt);
      out.indian_debt -= fromDebt;
      out.intl_equity += fromDebt;
    } else if (delta < 0) {
      out.indian_equity += -delta;
      out.intl_equity = target;
    }
  }

  return out;
}
