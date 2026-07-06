import type {
  ClientProfile,
  DriftReport,
  IPS,
  PortfolioMetrics,
} from "../../types/domain";
import { ASSET_CLASS_LABELS } from "../../types/domain";

export function draftReviewLetter(args: {
  profile: ClientProfile;
  ips: IPS;
  metrics: PortfolioMetrics;
  drift: DriftReport;
}): { subject: string; paragraphs: string[] } {
  const { profile, ips, metrics, drift } = args;

  const breaches = drift.items.filter((i) => i.breach);

  const performance = `Dear Investment Committee, we are pleased to enclose the quarterly review of your ${profile.investorLabel.toLowerCase()} portfolio of ₹${profile.amountCr.toLocaleString("en-IN")} crore. The policy portfolio carries a since-inception annualised return expectation of ${metrics.expectedCagr}% against the strategic benchmark of ${ips.returnExpectation.benchmark}, and positioning through the quarter remained consistent with the ${profile.objectiveLabel.toLowerCase()} mandate documented in your Investment Policy Statement.`;

  const market = `On the domestic front, Indian markets continue to be underpinned by resilient corporate earnings, a stable banking system and the structural formalisation of the economy, even as valuations in select pockets warrant selectivity. Globally, the interplay of developed-market monetary policy, currency movements and geopolitical developments continues to argue for measured diversification across geographies and asset classes rather than concentrated directional positioning.`;

  const changes =
    breaches.length > 0
      ? `Market movement over the period has carried ${breaches.length === 1 ? "one asset class" : `${breaches.length} asset classes`} outside the ±${ips.rebalancing.corridorPct}% policy corridor: ${breaches
          .map(
            (b) =>
              `${ASSET_CLASS_LABELS[b.assetClass]} at ${b.currentPct}% versus a ${b.targetPct}% target`,
          )
          .join("; ")}. No other structural changes were made to the portfolio during the quarter.`
      : `Market movement over the period has kept every asset class within its ±${ips.rebalancing.corridorPct}% policy corridor, with a maximum deviation of ${drift.maxDeviation}% from target. No structural changes were made to the portfolio during the quarter.`;

  const risk = `On risk, the portfolio's expected volatility stands at ${metrics.volatility}% per annum with an estimated peak-to-trough drawdown of ${metrics.maxDrawdownEst}% under stressed conditions, corresponding to a risk score of ${metrics.riskScore}/100. This remains within the maximum drawdown tolerance of ${ips.riskProfile.maxDrawdownTolerance}% recorded in the IPS, and the portfolio's Sharpe ratio of ${metrics.sharpe.toFixed(2)} continues to reflect an efficient trade-off between return and risk.`;

  const actions =
    breaches.length > 0
      ? `Recommended actions for the coming quarter: ${breaches
          .map((b) => `${b.action} in ${ASSET_CLASS_LABELS[b.assetClass]}`)
          .join("; ")}. Executing these trades will restore all asset classes to their policy targets; we will present indicative execution levels for approval before proceeding.`
      : `No rebalancing action is required this quarter; all allocations remain within policy corridors. We will continue to monitor drift on a ${ips.reviewFrequency.toLowerCase()} cycle and will revert promptly should any corridor be breached intra-quarter.`;

  const closing = `We would be glad to discuss this review, or any evolution in your objectives, constraints or liquidity requirements, at your convenience. We thank you for your continued confidence. Yours faithfully, NINJA Advisory — Institutional Wealth Management.`;

  return {
    subject: `Quarterly Portfolio Review — ${profile.investorLabel}`,
    paragraphs: [performance, market, changes, risk, actions, closing],
  };
}
