"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartContainerProps {
  children: ReactNode;
  /** explicit pixel height — charts need a fixed height for ResponsiveContainer */
  height?: number;
  className?: string;
}

/**
 * Mounted-guard wrapper for Recharts. With static export, charts must not
 * render during hydration; show a Skeleton until the client has mounted.
 */
export function ChartContainer({
  children,
  height = 320,
  className,
}: ChartContainerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className={className} style={{ height }} />;
  }
  return (
    <div className={className} style={{ height }}>
      {children}
    </div>
  );
}
