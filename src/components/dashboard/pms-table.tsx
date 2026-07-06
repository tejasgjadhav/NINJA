"use client";

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

const headClass =
  "text-[11px] font-medium tracking-wider text-muted-foreground uppercase";

interface PmsTableProps {
  recommendations: ProductRecommendation[];
}

export function PmsTable({ recommendations }: PmsTableProps) {
  const pms = recommendations.filter((r) => r.product.type === "pms");

  if (pms.length === 0) {
    return (
      <Card size="sm">
        <CardContent>
          <p className="text-sm text-muted-foreground">
            PMS strategies are offered for mandates ≥ ₹5 Cr with growth risk
            profiles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PMS Strategies</CardTitle>
        <CardDescription>
          Discretionary portfolio management mandates
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={headClass}>Manager / Strategy</TableHead>
              <TableHead className={headClass}>Category</TableHead>
              <TableHead className={cn(headClass, "text-right")}>
                Allocation
              </TableHead>
              <TableHead className={cn(headClass, "text-right")}>
                Amount
              </TableHead>
              <TableHead className={headClass}>Thesis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pms.map((rec) => (
              <TableRow key={rec.product.id}>
                <TableCell>
                  <div className="font-medium">{rec.product.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {rec.product.manager}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {rec.product.category}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPct(rec.allocationPct)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCrore(rec.amountCr, 1)}
                </TableCell>
                <TableCell className="max-w-[340px] text-xs whitespace-normal text-muted-foreground">
                  {rec.product.thesis}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
