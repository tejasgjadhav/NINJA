"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCrore, formatPct } from "@/lib/format";
import type { ProductRecommendation } from "@/types/domain";

function riskBadge(level: 1 | 2 | 3 | 4 | 5) {
  if (level <= 2)
    return { label: level === 1 ? "Low" : "Low–Moderate", className: "" };
  if (level === 3)
    return { label: "Moderate", className: "" };
  return {
    label: level === 4 ? "High" : "Very High",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  };
}

const headClass =
  "text-[11px] font-medium tracking-wider text-muted-foreground uppercase";

interface FundsTableProps {
  recommendations: ProductRecommendation[];
}

export function FundsTable({ recommendations }: FundsTableProps) {
  const funds = recommendations.filter((r) => r.product.type !== "pms");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Recommendations</CardTitle>
        <CardDescription>
          Mutual funds, ETFs and index funds implementing the policy allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={headClass}>Fund</TableHead>
              <TableHead className={headClass}>Category</TableHead>
              <TableHead className={headClass}>Risk</TableHead>
              <TableHead className={cn(headClass, "text-right")}>
                Allocation
              </TableHead>
              <TableHead className={cn(headClass, "text-right")}>
                Amount
              </TableHead>
              <TableHead className={headClass}>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funds.map((rec) => {
              const risk = riskBadge(rec.product.riskLevel);
              return (
                <TableRow key={rec.product.id}>
                  <TableCell className="max-w-[320px]">
                    <div className="font-medium">{rec.product.name}</div>
                    <div className="mt-0.5 text-xs whitespace-normal text-muted-foreground">
                      {rec.product.thesis}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rec.product.category}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={risk.className}>
                      {risk.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPct(rec.allocationPct)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCrore(rec.amountCr, 1)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rec.product.role}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
