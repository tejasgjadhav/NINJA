"use client";

import { useState } from "react";

import type { AmountQuestion } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inr = new Intl.NumberFormat("en-IN");

/** "1,00,000.5" → 100000.5; null when not a valid positive number */
function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** en-IN grouping on the integer part, preserving a typed decimal part */
function formatDisplay(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (cleaned === "") return "";
  const [intPart, ...rest] = cleaned.split(".");
  const grouped = intPart === "" ? "" : inr.format(Number(intPart));
  return rest.length > 0 ? `${grouped}.${rest.join("")}` : grouped;
}

interface AmountInputProps {
  question: AmountQuestion;
  disabled?: boolean;
  onSubmit: (amountCr: number, label: string) => void;
}

export function AmountInput({ question, disabled, onSubmit }: AmountInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const amount = parseAmount(value);
    if (amount === null || amount < question.minCr || amount > question.maxCr) {
      setError(
        `Enter an amount between ₹${inr.format(question.minCr)} Cr and ₹${inr.format(question.maxCr)} Cr.`
      );
      return;
    }
    onSubmit(amount, `₹${inr.format(amount)} Cr`);
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex flex-wrap gap-2">
        {question.quickPicks.map((pick) => (
          <Button
            key={pick}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => {
              setValue(inr.format(pick));
              setError(null);
            }}
          >
            ₹{inr.format(pick)} Cr
          </Button>
        ))}
      </div>
      <div className="flex items-start gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Investable corpus"
            aria-label="Investment amount in rupees crore"
            aria-invalid={error !== null || undefined}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              setValue(formatDisplay(e.target.value));
              setError(null);
            }}
            className="pr-10 pl-7"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            Cr
          </span>
        </div>
        <Button type="submit" disabled={disabled}>
          Confirm
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
