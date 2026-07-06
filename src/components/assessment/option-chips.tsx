"use client";

import { useState } from "react";

import type {
  MultiSelectQuestion,
  SingleSelectQuestion,
} from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OptionChipsProps {
  question: SingleSelectQuestion<string> | MultiSelectQuestion<string>;
  disabled?: boolean;
  /** values and their labels, in question option order */
  onAnswer: (values: string[], labels: string[]) => void;
}

export function OptionChips({ question, disabled, onAnswer }: OptionChipsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const isMulti = question.kind === "multi";
  const exclusiveValue = isMulti ? question.exclusiveValue : undefined;

  function toggle(value: string) {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (exclusiveValue !== undefined) {
        if (value === exclusiveValue) return [value];
        return [...prev.filter((v) => v !== exclusiveValue), value];
      }
      return [...prev, value];
    });
  }

  function confirm() {
    const ordered = question.options.filter((o) => selected.includes(o.value));
    onAnswer(
      ordered.map((o) => o.value),
      ordered.map((o) => o.label)
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = isMulti && selected.includes(option.value);
          return (
            <Button
              key={option.value}
              type="button"
              variant={isSelected ? "default" : "outline"}
              disabled={disabled}
              onClick={() =>
                isMulti
                  ? toggle(option.value)
                  : onAnswer([option.value], [option.label])
              }
              className={cn(
                "h-auto flex-col items-start gap-0.5 rounded-lg px-3.5 py-2 text-left whitespace-normal",
                option.hint && "max-w-64"
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {option.hint && (
                <span
                  className={cn(
                    "text-xs font-normal",
                    isSelected
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {option.hint}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      {isMulti && (
        <Button
          type="button"
          disabled={disabled || selected.length === 0}
          onClick={confirm}
        >
          Confirm selection
        </Button>
      )}
    </div>
  );
}
