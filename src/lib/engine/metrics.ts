import type { AssetAllocation, PortfolioMetrics } from "../../types/domain";
import { ASSET_CLASSES } from "../../types/domain";
import { CMA, CORRELATION, RISK_FREE_PCT } from "../../data/cma";

export function computeMetrics(allocation: AssetAllocation): PortfolioMetrics {
  const w = ASSET_CLASSES.map((c) => allocation[c].target / 100);
  const rets = ASSET_CLASSES.map((c) => CMA[c].expectedReturnPct);
  const vols = ASSET_CLASSES.map((c) => CMA[c].volatilityPct);

  const expReturn = w.reduce((s, wi, i) => s + wi * rets[i], 0);

  let variance = 0;
  for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < w.length; j++) {
      variance += w[i] * w[j] * CORRELATION[i][j] * vols[i] * vols[j];
    }
  }
  const vol = Math.sqrt(variance);

  const sharpe = (expReturn - RISK_FREE_PCT) / vol;
  const riskScore = Math.round(
    Math.min(100, Math.max(1, 1 + ((vol - 2) * 99) / 16)),
  );

  return {
    expectedCagr: Math.round(expReturn * 10) / 10,
    volatility: Math.round(vol * 10) / 10,
    sharpe: Math.round(sharpe * 100) / 100,
    maxDrawdownEst: Math.round(-2.1 * vol),
    riskScore,
  };
}
