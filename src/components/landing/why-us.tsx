import { Check } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";

const points = [
  "A policy-first process — every mandate begins with a written IPS",
  "Deterministic allocation engine, free of discretionary drift",
  "A whole-portfolio risk lens across every holding and account",
  "Transparent product selection with documented rationale",
  "Quarterly governance cadence with board-ready reporting",
  "Built for fiduciaries, trustees and investment committees",
];

export function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Our Discipline
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why institutional investors choose us
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Institutions do not buy products; they adopt policies. Our platform
            applies the same discipline that governs endowments and pension
            mandates: objectives stated in writing, allocations derived from
            policy rather than opinion, and every decision documented for
            review. The result is a portfolio whose behaviour can be explained
            — in advance, and in writing — to any committee that asks.
          </p>
        </FadeIn>

        <StaggerGroup className="flex flex-col justify-center gap-5">
          {points.map((point) => (
            <StaggerItem key={point} className="flex items-start gap-4">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3.5" strokeWidth={2.5} />
              </span>
              <p className="text-sm leading-relaxed text-foreground">{point}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
