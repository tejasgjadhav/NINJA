import type {
  Constraint,
  Horizon,
  InvestorType,
  Objective,
  RiskTolerance,
} from "./domain";

export interface QuestionOption<V extends string = string> {
  value: V;
  label: string;
  /** optional one-line qualifier shown under the label */
  hint?: string;
}

interface BaseQuestion {
  id: string;
  /** Advisor message introducing the question */
  advisorText: string;
  /** Short heading, e.g. "Investor Type" */
  title: string;
}

export interface SingleSelectQuestion<V extends string = string>
  extends BaseQuestion {
  kind: "single";
  options: QuestionOption<V>[];
}

export interface MultiSelectQuestion<V extends string = string>
  extends BaseQuestion {
  kind: "multi";
  options: QuestionOption<V>[];
  /** value that clears/excludes all others, e.g. "none" */
  exclusiveValue?: V;
}

export interface AmountQuestion extends BaseQuestion {
  kind: "amount";
  /** quick-pick amounts in ₹ crore */
  quickPicks: number[];
  minCr: number;
  maxCr: number;
}

export type Question =
  | SingleSelectQuestion<InvestorType>
  | SingleSelectQuestion<Objective>
  | SingleSelectQuestion<Horizon>
  | SingleSelectQuestion<RiskTolerance>
  | AmountQuestion
  | MultiSelectQuestion<Constraint>;

export interface ChatMessage {
  id: string;
  from: "advisor" | "client";
  text: string;
}
