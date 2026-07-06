"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPct } from "@/lib/format";
import type { GeographicExposure } from "@/types/domain";

const REGIONS: Array<{ key: keyof GeographicExposure; label: string }> = [
  { key: "india", label: "India" },
  { key: "us", label: "United States" },
  { key: "europe", label: "Europe" },
  { key: "asia", label: "Asia ex-India" },
  { key: "others", label: "Others" },
];

interface GeoExposureProps {
  geo: GeographicExposure;
}

export function GeoExposure({ geo }: GeoExposureProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Exposure</CardTitle>
        <CardDescription>Look-through exposure of recommended holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {REGIONS.map((region, i) => {
            const value = geo[region.key];
            return (
              <li key={region.key} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-foreground">{region.label}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatPct(value)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(value, 0)}%`,
                      backgroundColor: `var(--chart-${(i % 5) + 1})`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
