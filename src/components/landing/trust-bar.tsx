"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface Stat {
  value?: number;
  format?: (n: number) => string;
  display?: string;
  label: string;
}

const stats: Stat[] = [
  {
    value: 12400,
    format: (n) => `₹${Math.round(n).toLocaleString("en-IN")} Cr`,
    label: "Assets under advisory",
  },
  {
    value: 140,
    format: (n) => `${Math.round(n)}+`,
    label: "Institutional mandates",
  },
  {
    value: 98,
    format: (n) => `${Math.round(n)}%`,
    label: "Client retention",
  },
  {
    display: "SEBI-registered",
    label: "Advisory framework",
  },
];

function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduce) {
      el.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.21, 0.65, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduce]);

  return <span ref={ref}>{format(0)}</span>;
}

export function TrustBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-6 py-10 ${i > 0 ? "border-l border-border max-lg:odd:border-l-0" : ""} ${i >= 2 ? "max-lg:border-t max-lg:border-border" : ""}`}
          >
            <p className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {stat.value !== undefined && stat.format ? (
                <CountUp to={stat.value} format={stat.format} />
              ) : (
                stat.display
              )}
            </p>
            <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
