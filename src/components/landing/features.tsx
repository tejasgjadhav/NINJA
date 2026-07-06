"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  PieChart,
  Activity,
  RefreshCw,
  BarChart3,
  Scale,
  type LucideIcon,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "IPS Generation",
    description:
      "Objectives, constraints and rebalancing bands codified into a formal Investment Policy Statement from your assessment.",
  },
  {
    icon: PieChart,
    title: "Portfolio Construction",
    description:
      "Deterministic allocation across asset classes and vetted products, mapped directly to your policy — never to a sales agenda.",
  },
  {
    icon: Activity,
    title: "Risk Analytics",
    description:
      "Whole-portfolio exposure, concentration and drawdown analysis, measured continuously against policy limits.",
  },
  {
    icon: RefreshCw,
    title: "Drift Monitoring & Rebalancing",
    description:
      "Allocations tracked against policy bands, with disciplined rebalancing proposals when tolerances are breached.",
  },
  {
    icon: BarChart3,
    title: "Institutional Reporting",
    description:
      "Board-ready performance, attribution and holdings reports, delivered on a predictable quarterly cadence.",
  },
  {
    icon: Scale,
    title: "Governance & Compliance",
    description:
      "A documented audit trail of every recommendation and rationale, built to fiduciary and regulatory standards.",
  },
];

function FeatureCard({ icon: Icon, title, description }: Feature) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full shadow-xs">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            The Platform
          </p>
          <h2 className="mt-4 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One policy-driven system, from assessment to reporting.
          </h2>
        </FadeIn>

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title} className="h-full">
              <FeatureCard {...feature} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
