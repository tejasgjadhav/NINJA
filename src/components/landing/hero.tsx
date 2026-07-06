import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

function HeroVisual() {
  return (
    <div aria-hidden className="relative h-full w-full text-primary">
      <style>{`
        @keyframes ninja-hero-draw { to { stroke-dashoffset: 0; } }
        .ninja-hero-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: ninja-hero-draw 2.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ninja-hero-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 560 420"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* faint grid */}
        <g stroke="currentColor" strokeOpacity="0.07" strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={60 * (i + 1)} x2="560" y2={60 * (i + 1)} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`v${i}`} x1={70 * (i + 1)} y1="0" x2={70 * (i + 1)} y2="420" />
          ))}
        </g>

        {/* concentric arcs */}
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="430" cy="120" r="46" strokeOpacity="0.12" />
          <circle cx="430" cy="120" r="72" strokeOpacity="0.08" />
          <circle cx="430" cy="120" r="98" strokeOpacity="0.05" />
        </g>

        {/* area under the curve */}
        <path
          d="M20 360 L100 322 L180 336 L260 268 L340 284 L420 196 L540 128 L540 420 L20 420 Z"
          fill="currentColor"
          fillOpacity="0.04"
        />

        {/* secondary (benchmark) line */}
        <path
          d="M20 372 L100 352 L180 356 L260 316 L340 322 L420 268 L540 224"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />

        {/* primary line, slowly drawn */}
        <path
          className="ninja-hero-draw"
          d="M20 360 L100 322 L180 336 L260 268 L340 284 L420 196 L540 128"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />

        {/* terminal marker */}
        <circle cx="540" cy="128" r="4" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-36">
        <div>
          <FadeIn once>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Institutional Wealth Advisory
            </p>
          </FadeIn>
          <FadeIn once delay={0.1}>
            <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Institutional portfolios, governed by intelligence.
            </h1>
          </FadeIn>
          <FadeIn once delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A structured six-question suitability assessment produces your
              Investment Policy Statement — and a model portfolio constructed,
              monitored and reported to institutional standards.
            </p>
          </FadeIn>
          <FadeIn once delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/assessment">Start Portfolio Assessment</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 px-6 text-base text-muted-foreground"
              >
                <a href="#features">Explore the platform</a>
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn once delay={0.25} className="hidden lg:block">
          <div className="aspect-4/3">
            <HeroVisual />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
