import type {
  AssessmentAnswers,
  ClientProfile,
  Horizon,
  InvestorType,
  Objective,
  RiskTolerance,
} from "../../types/domain";

export const INVESTOR_LABELS: Record<InvestorType, string> = {
  corporate_treasury: "Corporate Treasury",
  trust: "Trust",
  family_office: "Family Office",
  endowment: "Endowment",
  foundation: "Foundation",
  pension_fund: "Pension Fund",
  hni: "High Net-Worth Individual",
  institutional: "Institutional Investor",
};

export const OBJECTIVE_LABELS: Record<Objective, string> = {
  capital_appreciation: "Capital Appreciation",
  wealth_preservation: "Wealth Preservation",
  income_generation: "Income Generation",
  liability_matching: "Liability Matching",
  inflation_protection: "Inflation Protection",
};

export const HORIZON_LABELS: Record<Horizon, string> = {
  short: "< 3 years",
  medium: "3 – 5 years",
  long: "5 – 10 years",
  very_long: "10+ years",
};

export const HORIZON_YEARS: Record<Horizon, number> = {
  short: 2,
  medium: 4,
  long: 7,
  very_long: 15,
};

export const RISK_LABELS: Record<RiskTolerance, string> = {
  conservative: "Conservative",
  moderate: "Moderate",
  moderately_aggressive: "Moderately Aggressive",
  aggressive: "Aggressive",
};

function deriveRiskCapacity(
  investorType: InvestorType,
  horizon: Horizon,
): "low" | "medium" | "high" {
  const longTerm = horizon === "long" || horizon === "very_long";
  switch (investorType) {
    case "pension_fund":
    case "endowment":
    case "foundation":
    case "trust":
      return longTerm ? "high" : "medium";
    case "corporate_treasury":
      return horizon === "short" ? "low" : "medium";
    case "family_office":
    case "hni":
    case "institutional":
      return longTerm ? "high" : "medium";
  }
}

export function buildProfile(answers: AssessmentAnswers): ClientProfile {
  return {
    investorType: answers.investorType,
    investorLabel: INVESTOR_LABELS[answers.investorType],
    objective: answers.objective,
    objectiveLabel: OBJECTIVE_LABELS[answers.objective],
    horizon: answers.horizon,
    horizonLabel: HORIZON_LABELS[answers.horizon],
    horizonYears: HORIZON_YEARS[answers.horizon],
    riskTolerance: answers.riskTolerance,
    riskToleranceLabel: RISK_LABELS[answers.riskTolerance],
    riskCapacity: deriveRiskCapacity(answers.investorType, answers.horizon),
    amountCr: answers.amountCr,
    constraints: answers.constraints,
  };
}
