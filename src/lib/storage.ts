import type { AssessmentAnswers } from "@/types/domain";

/** Namespaced: github.io shares origin across all project sites */
const KEY = "ninja.assessment.v1";

export function saveAnswers(answers: AssessmentAnswers): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(answers));
}

export function loadAnswers(): AssessmentAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AssessmentAnswers;
    if (parsed.version !== 1 || typeof parsed.amountCr !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
