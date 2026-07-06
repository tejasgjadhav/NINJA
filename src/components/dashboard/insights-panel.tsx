"use client";

import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Insight } from "@/types/domain";

const SEVERITY: Record<
  Insight["severity"],
  { label: string; icon: LucideIcon; badgeClass: string; iconClass: string }
> = {
  info: {
    label: "Informational",
    icon: Info,
    badgeClass: "border-border bg-muted text-muted-foreground",
    iconClass: "text-muted-foreground",
  },
  positive: {
    label: "On Track",
    icon: CheckCircle2,
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
  watch: {
    label: "Attention",
    icon: AlertTriangle,
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    iconClass: "text-amber-700 dark:text-amber-400",
  },
};

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        AI Insights
      </h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => {
          const config = SEVERITY[insight.severity];
          return (
            <Card key={insight.id} size="sm">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <config.icon
                    className={`size-4 shrink-0 ${config.iconClass}`}
                  />
                  <Badge variant="outline" className={config.badgeClass}>
                    {config.label}
                  </Badge>
                </div>
                <div className="text-sm font-medium">{insight.title}</div>
                <p className="text-sm text-muted-foreground">{insight.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
