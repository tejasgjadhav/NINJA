import { FadeIn } from "@/components/motion/fade-in";

const steps = [
  {
    number: "01",
    title: "Structured Assessment",
    description:
      "A six-question suitability interview establishes your objectives, horizon, liquidity needs and tolerance for loss.",
  },
  {
    number: "02",
    title: "Investment Policy Statement",
    description:
      "Your answers are codified into a formal IPS — objectives, constraints and rebalancing bands, stated in writing before any product is discussed.",
  },
  {
    number: "03",
    title: "Model Portfolio & Dashboard",
    description:
      "A policy-mapped model portfolio is constructed, then monitored through continuous analytics and institutional-grade reporting.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-y border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            The Process
          </p>
          <h2 className="mt-4 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From first interview to governed portfolio, in three steps.
          </h2>
        </FadeIn>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* connecting hairline (desktop) */}
          <div
            aria-hidden
            className="absolute top-6 right-[16.67%] left-[16.67%] hidden h-px bg-border md:block"
          />
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.12} className="relative">
              <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background font-heading text-sm font-semibold text-primary">
                {step.number}
              </div>
              <h3 className="mt-6 font-heading text-xl font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
