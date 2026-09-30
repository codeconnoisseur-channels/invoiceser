import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="border-b border-border bg-primary py-16 text-primary-foreground sm:py-20" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">Your next invoice can be the easy one</p>
          <h2 id="cta-heading" className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Send it today. Let Invoiceser handle what comes next.</h2>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-2"><Check className="size-4" aria-hidden="true" />Free plan included</span>
            <span className="flex items-center gap-2"><Check className="size-4" aria-hidden="true" />No card required</span>
          </div>
        </div>
        <Button asChild size="lg" variant="secondary" className="shrink-0">
          <Link href="/sign-up">Create your free account<ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
        </Button>
      </div>
    </section>
  );
}
