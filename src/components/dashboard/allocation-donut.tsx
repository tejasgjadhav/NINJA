"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/dashboard/chart-container";
import { formatPct } from "@/lib/format";
import {
  ASSET_CLASSES,
  ASSET_CLASS_LABELS,
  type AssetAllocation,
  type GeographicExposure,
} from "@/types/domain";

interface AllocationDonutProps {
  allocation: AssetAllocation;
  geo: GeographicExposure;
}

export function AllocationDonut({ allocation, geo }: AllocationDonutProps) {
  const slices = ASSET_CLASSES.filter((ac) => allocation[ac].target > 0).map(
    (ac, i) => ({
      assetClass: ac,
      name: ASSET_CLASS_LABELS[ac],
      value: allocation[ac].target,
      band: allocation[ac],
      color: `var(--chart-${(i % 5) + 1})`,
    })
  );

  const intlTarget = allocation.intl_equity.target;
  const nonIndia = Math.max(0, 100 - geo.india);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Asset Allocation</CardTitle>
        <CardDescription>Policy targets with permitted bands</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid items-center gap-6 sm:grid-cols-[240px_1fr]">
          <div className="relative mx-auto w-full max-w-[240px]">
            <ChartContainer height={240}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="65%"
                    outerRadius="95%"
                    paddingAngle={2}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.assetClass} fill={slice.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums">
                {slices.length}
              </span>
              <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Asset Classes
              </span>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5">
            {slices.map((slice) => (
              <li
                key={slice.assetClass}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate">{slice.name}</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  <span className="font-medium">{slice.value}%</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({slice.band.min}–{slice.band.max}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
          <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              International Allocation
            </span>{" "}
            — {formatPct(intlTarget, 0)} target to international equity;{" "}
            {formatPct(nonIndia)} total non-India exposure on a look-through
            basis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
