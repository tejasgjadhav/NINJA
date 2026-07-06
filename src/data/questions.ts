import type { Question } from "@/types/assessment";

export const QUESTIONS: Question[] = [
  {
    id: "investorType",
    kind: "single",
    title: "Investor Type",
    advisorText:
      "Welcome to NINJA Advisory. I will conduct a brief suitability assessment to construct your Investment Policy Statement and model portfolio. To begin — which best describes your organisation or mandate?",
    options: [
      { value: "corporate_treasury", label: "Corporate Treasury" },
      { value: "trust", label: "Trust" },
      { value: "family_office", label: "Family Office" },
      { value: "endowment", label: "Endowment" },
      { value: "foundation", label: "Foundation" },
      { value: "pension_fund", label: "Pension Fund" },
      { value: "hni", label: "High Net-Worth Individual" },
      { value: "institutional", label: "Institutional Investor" },
    ],
  },
  {
    id: "objective",
    kind: "single",
    title: "Investment Objective",
    advisorText: "Understood. What is the primary objective of this mandate?",
    options: [
      { value: "capital_appreciation", label: "Capital Appreciation" },
      { value: "wealth_preservation", label: "Wealth Preservation" },
      { value: "income_generation", label: "Income Generation" },
      { value: "liability_matching", label: "Liability Matching" },
      { value: "inflation_protection", label: "Inflation Protection" },
    ],
  },
  {
    id: "horizon",
    kind: "single",
    title: "Investment Horizon",
    advisorText: "What is the intended investment horizon for this portfolio?",
    options: [
      { value: "short", label: "Less than 3 years" },
      { value: "medium", label: "3 – 5 years" },
      { value: "long", label: "5 – 10 years" },
      { value: "very_long", label: "10+ years" },
    ],
  },
  {
    id: "riskTolerance",
    kind: "single",
    title: "Risk Tolerance",
    advisorText:
      "How would you characterise the mandate's tolerance for drawdowns and interim volatility?",
    options: [
      {
        value: "conservative",
        label: "Conservative",
        hint: "Capital stability first; limited equity",
      },
      {
        value: "moderate",
        label: "Moderate",
        hint: "Balanced growth with controlled drawdowns",
      },
      {
        value: "moderately_aggressive",
        label: "Moderately Aggressive",
        hint: "Growth-oriented; accepts market cycles",
      },
      {
        value: "aggressive",
        label: "Aggressive",
        hint: "Maximum long-term growth; high volatility tolerance",
      },
    ],
  },
  {
    id: "amountCr",
    kind: "amount",
    title: "Investment Amount",
    advisorText:
      "What is the investable corpus for this mandate, in ₹ crore?",
    quickPicks: [50, 100, 500, 1000],
    minCr: 1,
    maxCr: 10000,
  },
  {
    id: "constraints",
    kind: "multi",
    title: "Constraints & Preferences",
    advisorText:
      "Finally — select any constraints or preferences that apply to this mandate. Choose all that apply, then confirm.",
    exclusiveValue: "none",
    options: [
      { value: "international", label: "Need international exposure" },
      { value: "esg", label: "ESG preference" },
      { value: "high_liquidity", label: "High liquidity" },
      { value: "tax_efficient", label: "Tax efficient" },
      { value: "sector_restrictions", label: "Sector restrictions" },
      { value: "capital_protection", label: "Capital protection" },
      { value: "none", label: "No restrictions" },
    ],
  },
];
