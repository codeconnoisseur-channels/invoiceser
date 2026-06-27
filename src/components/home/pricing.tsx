"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Pricing() {
  const [billing, setBilling] = useState<"quarterly" | "yearly">("yearly");

  type Plan = {
    name: string;
    price: string;
    period: string;
    billingText?: string;
    savings?: string;
    description: string;
    features: string[];
    cta: string;
    href: string;
    highlighted: boolean;
  };

  const plans: Record<"quarterly" | "yearly", Plan[]> = {
    quarterly: [
      {
        name: "Free",
        price: "$0",
        period: "/mo",
        description: "Everything you need to start invoicing.",
        features: [
          "Unlimited clients & invoices",
          "PDF download & email delivery",
          "Automatic payment reminders",
          "Logo upload & brand colour",
          "Custom invoice fonts",
          "AI chatbot (10 queries/month)",
        ],
        cta: "Get started free",
        href: "/sign-up",
        highlighted: false,
      },
      {
        name: "Pro",
        price: "$12",
        period: "/mo",
        billingText: "Billed $36 quarterly",
        description: "For freelancers who want the full picture.",
        features: [
          "Everything in Free",
          "No Invoiceser mention on invoices",
          "Predictive analytics & revenue forecasts",
          "Unlimited AI chatbot queries",
          "Custom email domain & editable templates",
          "Priority support",
        ],
        cta: "Get started with Pro",
        href: "/sign-up",
        highlighted: true,
      },
    ],
    yearly: [
      {
        name: "Free",
        price: "$0",
        period: "/mo",
        description: "Everything you need to start invoicing.",
        features: [
          "Unlimited clients & invoices",
          "PDF download & email delivery",
          "Automatic payment reminders",
          "Logo upload & brand colour",
          "Custom invoice fonts",
          "AI chatbot (10 queries/month)",
        ],
        cta: "Get started free",
        href: "/sign-up",
        highlighted: false,
      },
      {
        name: "Pro",
        price: "$10",
        period: "/mo",
        billingText: "Billed $120 yearly",
        savings: "Save 20%",
        description: "For freelancers who want the full picture.",
        features: [
          "Everything in Free",
          "No Invoiceser mention on invoices",
          "Predictive analytics & revenue forecasts",
          "Unlimited AI chatbot queries",
          "Custom email domain & editable templates",
          "Priority support",
        ],
        cta: "Get started with Pro",
        href: "/sign-up",
        highlighted: true,
      },
    ],
  };

  const currentPlans = plans[billing];

  return (
    <section id="pricing" className="py-20 bg-gray-50/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Choose the plan that fits your needs.</h2>
          <p className="text-lg leading-relaxed text-gray-500 font-medium mb-10">Starting from only $10 per month. Cancel anytime.</p>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setBilling("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  billing === "yearly" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setBilling("quarterly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  billing === "quarterly" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Quarterly
              </button>
            </div>
            <p className="text-sm font-bold text-blue-600">Save 33% on a yearly subscription</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {currentPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col h-full rounded-[2rem] p-10 transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 ring-1 ring-gray-900"
                  : "bg-white shadow-card ring-1 ring-gray-200/60"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                  Most popular
                </span>
              )}
              <p
                className={`mb-4 text-sm font-bold tracking-widest uppercase ${
                  plan.highlighted ? "text-primary-400" : "text-gray-500"
                }`}
              >
                {plan.name}
              </p>
              <div className="mb-2 flex items-end gap-1">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className={`mb-2 text-base font-medium ${plan.highlighted ? "text-gray-400" : "text-gray-400"}`}>{plan.period}</span>
                )}
              </div>
              <div className="h-6 mb-6">
                {plan.billingText ? (
                  <p className={`text-sm font-medium ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                    {plan.billingText}
                    {plan.savings && <span className="ml-2 text-emerald-400 font-bold">{plan.savings}</span>}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">Free forever</p>
                )}
              </div>
              <p
                className={`mb-10 text-base font-medium ${
                  plan.highlighted ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <ul className="mb-10 space-y-4" role="list">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm font-medium">
                    <CheckCircle2
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-primary-400" : "text-primary-600"
                      }`}
                    />
                    <span className={plan.highlighted ? "text-gray-200" : "text-gray-700"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-auto block rounded-xl py-4 text-center text-sm font-bold transition-all ${
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-100 hover:scale-[1.02]"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02] shadow-md"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
