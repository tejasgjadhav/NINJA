"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import {
  Activity,
  Gauge,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCrore, formatPct } from "@/lib/format";
import type { PortfolioMetrics } from "@/types/domain";

function CountUp({
  value,
  format,
}: {
  value: number;
  format: (v: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatRef = useRef(format);
  formatRef.current = format;
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = formatRef.current(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = formatRef.current(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}

interface StatCardsProps {
  metrics: PortfolioMetrics;
  amountCr: number;
}

export function StatCards({ metrics, amountCr }: StatCardsProps) {
  const stats: Array<{
    label: string;
    icon: LucideIcon;
    value: number;
    format: (v: number) => string;
  }> = [
    {
      label: "Total Investment",
      icon: Wallet,
      value: amountCr,
      format: (v) => formatCrore(v),
    },
    {
      label: "Expected CAGR",
      icon: TrendingUp,
      value: metrics.expectedCagr,
      format: (v) => formatPct(v),
    },
    {
      label: "Expected Volatility",
      icon: Activity,
      value: metrics.volatility,
      format: (v) => formatPct(v),
    },
    {
      label: "Sharpe Ratio",
      icon: Scale,
      value: metrics.sharpe,
      format: (v) => v.toFixed(2),
    },
    {
      label: "Max Drawdown Est.",
      icon: TrendingDown,
      value: metrics.maxDrawdownEst,
      format: (v) => `−${formatPct(Math.abs(v))}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </span>
              <stat.icon className="size-3.5 shrink-0 text-muted-foreground/70" />
            </div>
            <span className="text-xl font-semibold tabular-nums lg:text-2xl">
              <CountUp value={stat.value} format={stat.format} />
            </span>
          </CardContent>
        </Card>
      ))}
      <Card size="sm">
        <CardContent className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Risk Score
            </span>
            <Gauge className="size-3.5 shrink-0 text-muted-foreground/70" />
          </div>
          <span className="text-xl font-semibold tabular-nums lg:text-2xl">
            <CountUp
              value={metrics.riskScore}
              format={(v) => `${Math.round(v)}/100`}
            />
          </span>
          <Progress value={metrics.riskScore} className="mt-1" />
        </CardContent>
      </Card>
    </div>
  );
}
