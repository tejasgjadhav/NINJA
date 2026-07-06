import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function CtaBand() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <FadeIn>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Begin with a policy, not a product.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/70">
                Six questions. One Investment Policy Statement. A portfolio you
                can defend to any committee.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-11 shrink-0 border-primary-foreground/20 bg-primary-foreground px-6 text-base text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/assessment">Start Portfolio Assessment</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
