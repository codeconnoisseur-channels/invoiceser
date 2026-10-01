"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import styles from "../../app/(public)/landing.module.css";

type Plan = { name: string; price: string; period: string; billingText?: string; savings?: string; description: string; features: string[]; cta: string; href: string; highlighted: boolean };

const plans: Record<"monthly" | "yearly", Plan[]> = {
  monthly: [
    { name: "Free", price: "$0", period: "/mo", description: "Everything you need to start invoicing.", features: ["Unlimited clients & invoices", "PDF download & email delivery", "Automatic payment reminders", "Logo upload & brand colour", "Custom invoice fonts", "AI chatbot (10 queries/month)"], cta: "Get started free", href: "/sign-up", highlighted: false },
    { name: "Pro", price: "$12", period: "/mo", description: "For freelancers who want the full picture.", features: ["Everything in Free", "No Invoiceser mention on invoices", "Predictive analytics & revenue forecasts", "Unlimited AI chatbot queries", "Custom email domain & editable templates", "Priority support"], cta: "Get started with Pro", href: "/sign-up", highlighted: true },
  ],
  yearly: [
    { name: "Free", price: "$0", period: "/mo", description: "Everything you need to start invoicing.", features: ["Unlimited clients & invoices", "PDF download & email delivery", "Automatic payment reminders", "Logo upload & brand colour", "Custom invoice fonts", "AI chatbot (10 queries/month)"], cta: "Get started free", href: "/sign-up", highlighted: false },
    { name: "Pro", price: "$10", period: "/mo", billingText: "Billed $120 yearly", savings: "Save 17%", description: "For freelancers who want the full picture.", features: ["Everything in Free", "No Invoiceser mention on invoices", "Predictive analytics & revenue forecasts", "Unlimited AI chatbot queries", "Custom email domain & editable templates", "Priority support"], cta: "Get started with Pro", href: "/sign-up", highlighted: true },
  ],
};

export function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const currentPlans = plans[billing] ?? plans.monthly;
  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Pricing</p><h2>Choose the plan that fits your needs.</h2><p>Starting from only $10 per month. Cancel anytime.</p></div>
      <div className={styles.billingWrap}>
        <div className={styles.billingToggle} aria-label="Billing period">
          <button type="button" aria-pressed={billing === "yearly"} onClick={() => setBilling("yearly")}>Yearly</button>
          <button type="button" aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</button>
        </div>
        {billing === "yearly" ? <p>Save 17% on a yearly subscription</p> : null}
      </div>
      <div className={styles.pricingGrid}>{currentPlans.map((plan) => (
        <article key={plan.name} className={plan.highlighted ? styles.proPlan : styles.freePlan}>
          {plan.highlighted ? <span className={styles.popular}>Most popular</span> : null}
          <p className={styles.planName}>{plan.name}</p><div className={styles.price}>{plan.price}<span>{plan.period}</span></div>
          <div className={styles.billingText}>{plan.billingText ?? (plan.name === "Free" ? "Free forever" : "")}{plan.savings ? <strong>{plan.savings}</strong> : null}</div>
          <p className={styles.planDescription}>{plan.description}</p>
          <ul role="list">{plan.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
          <Link href={plan.href} className={plan.highlighted ? styles.planPrimary : styles.planSecondary}>{plan.cta}<ArrowRight aria-hidden="true" /></Link>
        </article>
      ))}</div>
    </section>
  );
}
