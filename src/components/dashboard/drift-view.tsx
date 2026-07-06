"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPct } from "@/lib/format";
import { ASSET_CLASS_LABELS, type DriftReport } from "@/types/domain";

interface DriftViewProps {
  drift: DriftReport;
}

export function DriftView({ drift }: DriftViewProps) {
  const maxScale = Math.max(
    ...drift.items.map((i) => Math.max(i.targetPct, i.currentPct)),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation Drift</CardTitle>
        <CardDescription>
          Simulated current weights vs policy targets · ±5% policy corridor
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {drift.rebalanceNeeded ? (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0" />
            <span>
              Rebalancing recommended — max deviation{" "}
              {formatPct(drift.maxDeviation)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Within policy corridors — no action required</span>
          </div>
        )}

        <ul className="flex flex-col gap-4">
          {drift.items.map((item) => {
            const deviationLabel = `${item.deviation >= 0 ? "+" : "−"}${formatPct(Math.abs(item.deviation))}`;
            return (
              <li key={item.assetClass} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-medium">
                    {ASSET_CLASS_LABELS[item.assetClass]}
                  </span>
                  <span className="flex items-center gap-2">
                    {item.action && (
                      <span className="text-xs text-muted-foreground">
                        {item.action}
                      </span>
                    )}
                    {item.breach ? (
                      <Badge variant="destructive">{deviationLabel}</Badge>
                    ) : (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {deviationLabel}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[var(--chart-4)]"
                        style={{ width: `${(item.targetPct / maxScale) * 100}%` }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                      Target {item.targetPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[var(--chart-1)]"
                        style={{
                          width: `${(item.currentPct / maxScale) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                      Current {formatPct(item.currentPct)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
