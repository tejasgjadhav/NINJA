"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { loadAnswers, clearAnswers } from "@/lib/storage";
import { formatCrore, formatDate } from "@/lib/format";
import type { AssessmentAnswers } from "@/types/domain";
import { buildProfile } from "@/lib/engine/profile";
import { buildAllocation } from "@/lib/engine/allocation";
import { buildIPS } from "@/lib/engine/ips";
import { selectProducts, getGeographicExposure } from "@/lib/engine/products";
import { computeMetrics } from "@/lib/engine/metrics";
import { simulateDrift } from "@/lib/engine/drift";
import { projectGoal } from "@/lib/engine/goals";
import { generateInsights } from "@/lib/engine/insights";
import { draftReviewLetter } from "@/lib/engine/review-letter";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AllocationDonut } from "@/components/dashboard/allocation-donut";
import { GeoExposure } from "@/components/dashboard/geo-exposure";
import { FundsTable } from "@/components/dashboard/funds-table";
import { PmsTable } from "@/components/dashboard/pms-table";
import { GoalTracker } from "@/components/dashboard/goal-tracker";
import { DriftView } from "@/components/dashboard/drift-view";
import { IpsSummary } from "@/components/dashboard/ips-summary";
import { ReviewLetter } from "@/components/dashboard/review-letter";
import { InsightsPanel } from "@/components/dashboard/insights-panel";

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[360px]" />
        <Skeleton className="h-[360px]" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

export function DashboardShell() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);

  useEffect(() => {
    setAnswers(loadAnswers());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !answers) router.replace("/assessment");
  }, [mounted, answers, router]);

  const data = useMemo(() => {
    if (!answers) return null;
    const profile = buildProfile(answers);
    const allocation = buildAllocation(answers);
    const ips = buildIPS(answers);
    const recommendations = selectProducts(allocation, answers);
    const geo = getGeographicExposure(recommendations);
    const metrics = computeMetrics(allocation);
    const drift = simulateDrift(allocation, answers);
    const goal = projectGoal(answers, metrics, profile);
    const insights = generateInsights({ profile, allocation, metrics, drift, geo });
    const letter = draftReviewLetter({ profile, ips, metrics, drift });
    return {
      profile,
      allocation,
      ips,
      recommendations,
      geo,
      metrics,
      drift,
      goal,
      insights,
      letter,
    };
  }, [answers]);

  const handleNewAssessment = () => {
    clearAnswers();
    router.push("/assessment");
  };

  if (!mounted || !answers || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="font-heading text-lg font-semibold tracking-tight"
          >
            NINJA Advisory
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Badge variant="secondary">{data.profile.investorLabel}</Badge>
            <span className="text-sm font-medium tabular-nums">
              {formatCrore(answers.amountCr)}
            </span>
            <span className="text-xs text-muted-foreground">
              Generated {formatDate(answers.completedAt)}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNewAssessment}>
              New Assessment
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="ips">IPS</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StaggerGroup className="flex flex-col gap-6" stagger={0.06}>
              <StaggerItem>
                <StatCards metrics={data.metrics} amountCr={answers.amountCr} />
              </StaggerItem>
              <StaggerItem>
                <div className="grid gap-4 lg:grid-cols-2">
                  <AllocationDonut
                    allocation={data.allocation}
                    geo={data.geo}
                  />
                  <GeoExposure geo={data.geo} />
                </div>
              </StaggerItem>
              <StaggerItem>
                <InsightsPanel insights={data.insights} />
              </StaggerItem>
            </StaggerGroup>
          </TabsContent>

          <TabsContent value="portfolio">
            <StaggerGroup className="flex flex-col gap-6" stagger={0.06}>
              <StaggerItem>
                <FundsTable recommendations={data.recommendations} />
              </StaggerItem>
              <StaggerItem>
                <PmsTable recommendations={data.recommendations} />
              </StaggerItem>
              <StaggerItem>
                <DriftView drift={data.drift} />
              </StaggerItem>
            </StaggerGroup>
          </TabsContent>

          <TabsContent value="ips">
            <StaggerGroup
              className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
              stagger={0.06}
            >
              <StaggerItem>
                <IpsSummary ips={data.ips} />
              </StaggerItem>
              <StaggerItem>
                <GoalTracker goal={data.goal} />
              </StaggerItem>
            </StaggerGroup>
          </TabsContent>

          <TabsContent value="reports">
            <StaggerGroup className="flex flex-col gap-6" stagger={0.06}>
              <StaggerItem>
                <ReviewLetter
                  letter={data.letter}
                  dateIso={answers.completedAt}
                />
              </StaggerItem>
            </StaggerGroup>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
