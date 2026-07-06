"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCrore, formatDate, formatPct } from "@/lib/format";
import { ASSET_CLASSES, ASSET_CLASS_LABELS, type IPS } from "@/types/domain";

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-heading text-base font-medium">
        {n}. {title}
      </h3>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

interface IpsSummaryProps {
  ips: IPS;
}

export function IpsSummary({ ips }: IpsSummaryProps) {
  const { profile } = ips;

  return (
    <Card className="[--card-spacing:--spacing(8)]">
      <CardContent className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            NINJA Advisory
          </span>
          <h2 className="font-heading text-2xl font-semibold">
            Investment Policy Statement
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.investorLabel} · {formatCrore(profile.amountCr)} mandate
          </p>
        </header>

        <Separator />

        <Section n={1} title="Client Profile">
          <p>
            {profile.investorLabel} with an investable corpus of{" "}
            {formatCrore(profile.amountCr)}, a {profile.horizonLabel.toLowerCase()}{" "}
            investment horizon (~{profile.horizonYears} years) and a{" "}
            {profile.riskToleranceLabel.toLowerCase()} risk tolerance.
          </p>
        </Section>

        <Section n={2} title="Investment Objectives">
          <p>{ips.objectivesNarrative}</p>
        </Section>

        <Section n={3} title="Return Expectation">
          <p>
            Target portfolio return of{" "}
            <span className="font-medium text-foreground">
              {formatPct(ips.returnExpectation.targetCagr)} CAGR
            </span>{" "}
            over the horizon, benchmarked against{" "}
            {ips.returnExpectation.benchmark}.
          </p>
        </Section>

        <Section n={4} title="Risk Profile">
          <ul className="list-disc space-y-1 pl-5">
            <li>Risk tolerance: {ips.riskProfile.toleranceLabel}</li>
            <li>Risk capacity: {ips.riskProfile.capacity}</li>
            <li>
              Maximum drawdown tolerance:{" "}
              {formatPct(ips.riskProfile.maxDrawdownTolerance, 0)}
            </li>
          </ul>
        </Section>

        <Section n={5} title="Liquidity Needs">
          <p>{ips.liquidityNeeds}</p>
        </Section>

        <Section n={6} title="Asset Allocation Guidelines">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-medium tracking-wider uppercase">
                    Asset Class
                  </TableHead>
                  <TableHead className="text-right text-[11px] font-medium tracking-wider uppercase">
                    Target
                  </TableHead>
                  <TableHead className="text-right text-[11px] font-medium tracking-wider uppercase">
                    Band
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSET_CLASSES.filter(
                  (ac) => ips.allocation[ac].target > 0
                ).map((ac) => (
                  <TableRow key={ac}>
                    <TableCell className="text-foreground">
                      {ASSET_CLASS_LABELS[ac]}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {ips.allocation[ac].target}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {ips.allocation[ac].min}–{ips.allocation[ac].max}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section n={7} title="Constraints">
          {ips.constraintsNarrative.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {ips.constraintsNarrative.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : (
            <p>No specific constraints beyond regulatory requirements.</p>
          )}
        </Section>

        <Section n={8} title="Review & Rebalancing">
          <p>
            Portfolio reviews conducted on a{" "}
            {ips.reviewFrequency.toLowerCase()} basis. Rebalancing follows a ±
            {ips.rebalancing.corridorPct}% corridor approach:{" "}
            {ips.rebalancing.method}
          </p>
        </Section>

        <Section n={9} title="Governance">
          <p>
            This Investment Policy Statement is prepared by NINJA Advisory on
            the basis of the suitability assessment completed by the client. It
            should be reviewed upon any material change in circumstances,
            objectives or market regime, and formally re-adopted at least
            annually.
          </p>
        </Section>

        <Separator />

        <footer className="text-xs text-muted-foreground">
          Generated {formatDate(ips.generatedAt)} · NINJA Advisory
        </footer>
      </CardContent>
    </Card>
  );
}
