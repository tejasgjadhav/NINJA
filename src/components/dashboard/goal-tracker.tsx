"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCrore, formatPct } from "@/lib/format";
import type { GoalProjection } from "@/types/domain";

interface GoalTrackerProps {
  goal: GoalProjection;
}

export function GoalTracker({ goal }: GoalTrackerProps) {
  const scenarios = [
    { label: "Conservative", value: goal.scenarios.conservative },
    { label: "Base", value: goal.scenarios.base },
    { label: "Optimistic", value: goal.scenarios.optimistic },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Projection</CardTitle>
        <CardDescription>
          Corpus outlook over the investment horizon
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Probability of Success
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">
            {formatPct(goal.probabilityOfSuccess, 0)}
          </div>
          <Progress value={goal.probabilityOfSuccess} className="mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Time Remaining
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {goal.years} years
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Expected Corpus
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {formatCrore(goal.expectedCorpusCr)}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Scenario Analysis
          </div>
          <ul className="flex flex-col gap-1.5">
            {scenarios.map((s) => (
              <li
                key={s.label}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium tabular-nums">
                  {formatCrore(s.value)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between border-t pt-2 text-sm">
            <span className="font-medium">Target corpus</span>
            <span className="font-semibold tabular-nums">
              {formatCrore(goal.targetCorpusCr)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
