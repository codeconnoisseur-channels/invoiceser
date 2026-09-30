"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BillingCycle = "quarterly" | "yearly";

const sharedFeatures = [
  "Unlimited clients and invoices",
  "PDF download and email delivery",
  "Automatic payment reminders",
  "Logo, brand colour, and invoice fonts",
];

const plans = {
  free: {
    name: "Free",
    description: "A complete invoicing setup for getting started.",
    features: [...sharedFeatures, "10 insight queries each month"],
  },
  pro: {
    name: "Pro",
    description: "More control and visibility for a growing practice.",
    features: [
      ...sharedFeatures,
      "No Invoiceser mention on invoices",
      "Forecasts and unlimited insight queries",
      "Custom email domain and templates",
      "Priority support",
    ],
  },
};

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("yearly");
  const proPrice = billing === "yearly" ? "$10" : "$12";

  return (
    <section id="pricing" className="scroll-mt-16 border-b border-border bg-secondary/55 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-8 border-b border-foreground pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Simple pricing</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Start free. Upgrade when it pays for itself.</h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="inline-flex rounded-md border border-border bg-background p-1" role="group" aria-label="Billing cycle">
              {(["yearly", "quarterly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  aria-pressed={billing === cycle}
                  onClick={() => setBilling(cycle)}
                  className={cn(
                    "min-h-11 rounded-sm px-4 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    billing === cycle ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cycle}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Yearly billing saves 20%</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{plans.free.name}</CardTitle>
              <CardDescription>{plans.free.description}</CardDescription>
              <div className="pt-5"><span className="text-5xl font-semibold tracking-[-0.04em]">$0</span><span className="ml-1 text-sm text-muted-foreground">forever</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="flex flex-col gap-3" role="list">
                {plans.free.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{feature}</span></li>
                ))}
              </ul>
            </CardContent>
            <CardFooter><Button asChild variant="outline" size="lg" className="w-full"><Link href="/sign-up">Start for free</Link></Button></CardFooter>
          </Card>

          <Card className="flex h-full flex-col border-primary">
            <CardHeader>
              <div className="flex items-center justify-between gap-4"><CardTitle className="text-xl">{plans.pro.name}</CardTitle><Badge variant="paid">Most popular</Badge></div>
              <CardDescription>{plans.pro.description}</CardDescription>
              <div className="pt-5"><span className="text-5xl font-semibold tracking-[-0.04em]">{proPrice}</span><span className="ml-1 text-sm text-muted-foreground">/ month</span></div>
              <p className="text-xs text-muted-foreground">{billing === "yearly" ? "Billed $120 yearly" : "Billed $36 quarterly"}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="flex flex-col gap-3" role="list">
                {plans.pro.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{feature}</span></li>
                ))}
              </ul>
            </CardContent>
            <CardFooter><Button asChild size="lg" className="w-full"><Link href="/sign-up">Start with Pro</Link></Button></CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
