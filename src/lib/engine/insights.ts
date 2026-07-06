import type {
  AssetAllocation,
  ClientProfile,
  DriftReport,
  GeographicExposure,
  Insight,
  PortfolioMetrics,
} from "../../types/domain";
import { ASSET_CLASSES, ASSET_CLASS_LABELS } from "../../types/domain";

export function generateInsights(args: {
  profile: ClientProfile;
  allocation: AssetAllocation;
  metrics: PortfolioMetrics;
  drift: DriftReport;
  geo: GeographicExposure;
}): Insight[] {
  const { profile, allocation, metrics, drift, geo } = args;
  const insights: Insight[] = [];

  // drift breach vs aligned (exactly one fires)
  if (drift.rebalanceNeeded) {
    const worst = drift.items
      .filter((i) => i.breach)
      .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))[0];
    insights.push({
      id: "drift-breach",
      severity: "watch",
      title: "Rebalancing recommended",
      body: `${ASSET_CLASS_LABELS[worst.assetClass]} has drifted ${worst.deviation > 0 ? "+" : ""}${worst.deviation}% from its ${worst.targetPct}% policy target, breaching the ±5% corridor. ${worst.action ?? ""}`.trim(),
    });
  } else {
    insights.push({
      id: "aligned",
      severity: "positive",
      title: `Portfolio aligned with ${profile.objectiveLabel.toLowerCase()} objective`,
      body: `All asset classes are within their ±5% policy corridors (max deviation ${drift.maxDeviation}%); no rebalancing action is required this quarter.`,
    });
  }

  // international exposure vs intl equity policy band
  const intlGeo = 100 - geo.india;
  const band = allocation.intl_equity;
  if (intlGeo < band.min) {
    insights.push({
      id: "intl-below-band",
      severity: "info",
      title: "International exposure below IPS band",
      body: `Look-through overseas exposure is ${intlGeo}%, below the ${band.min}–${band.max}% policy band for international equity. Consider topping up the overseas sleeve at the next rebalance.`,
    });
  } else if (intlGeo > band.max) {
    insights.push({
      id: "intl-above-band",
      severity: "watch",
      title: "International exposure above IPS band",
      body: `Look-through overseas exposure is ${intlGeo}%, above the ${band.min}–${band.max}% policy band for international equity, adding currency and offshore-market risk beyond policy.`,
    });
  } else {
    insights.push({
      id: "intl-within-band",
      severity: "positive",
      title: "International exposure within IPS band",
      body: `Look-through overseas exposure of ${intlGeo}% sits within the ${band.min}–${band.max}% policy band, providing rupee diversification without breaching policy.`,
    });
  }

  // debt allocation vs policy band (uses simulated current)
  const debtItem = drift.items.find((i) => i.assetClass === "indian_debt");
  if (debtItem) {
    const { min, max } = allocation.indian_debt;
    if (debtItem.currentPct < min || debtItem.currentPct > max) {
      insights.push({
        id: "debt-outside-band",
        severity: "watch",
        title: "Debt allocation outside policy band",
        body: `Indian debt currently stands at ${debtItem.currentPct}% against a ${min}–${max}% policy band; restoring it protects the portfolio's income and stability anchor.`,
      });
    }
  }

  // single-class concentration
  const concentrated = ASSET_CLASSES.find((c) => allocation[c].target > 55);
  if (concentrated) {
    insights.push({
      id: "concentration",
      severity: "watch",
      title: `Concentration in ${ASSET_CLASS_LABELS[concentrated]}`,
      body: `${ASSET_CLASS_LABELS[concentrated]} represents ${allocation[concentrated].target}% of the policy portfolio; a single-class weight above 55% concentrates factor risk and merits monitoring.`,
    });
  }

  // thin cash buffer
  if (allocation.cash.target < 3) {
    insights.push({
      id: "liquidity-thin",
      severity: "info",
      title: "Thin liquidity buffer",
      body: `The cash allocation of ${allocation.cash.target}% is below a typical 3% operating buffer; unplanned outflows may force untimely sales of longer-duration assets.`,
    });
  }

  // ESG confirmation
  if (profile.constraints.includes("esg")) {
    insights.push({
      id: "esg-screen",
      severity: "positive",
      title: "ESG screening in effect",
      body: "Listed-equity selections apply exclusionary ESG screens in line with the mandate; the screened funds substitute for conventional equivalents without altering the policy allocation.",
    });
  }

  // risk-return summary (always)
  insights.push({
    id: "risk-return",
    severity: "info",
    title: "Risk-return positioning",
    body: `The policy portfolio carries an expected CAGR of ${metrics.expectedCagr}% at ${metrics.volatility}% volatility (Sharpe ${metrics.sharpe.toFixed(2)}), placing it at ${metrics.riskScore}/100 on the risk spectrum — consistent with a ${profile.riskToleranceLabel.toLowerCase()} mandate.`,
  });

  return insights.slice(0, 7);
}
