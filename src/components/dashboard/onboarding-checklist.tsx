"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function OnboardingChecklist() {
  const settings = useQuery(api.settings.getSettings);
  const clients  = useQuery(api.clients.listClients);
  const invoices = useQuery(api.invoices.getRecentInvoices);
  const [collapsed, setCollapsed] = useState(false);

  if (settings === undefined || clients === undefined || invoices === undefined) return null;

  const hasPaymentDetails = !!(
    settings?.paymentBankName ||
    settings?.paymentAccountNumber ||
    settings?.paymentLink ||
    settings?.paymentInstructions
  );

  const steps = [
    {
      label: "Account created",
      done: true,
      href: null,
      action: null,
      description: null,
    },
    {
      label: "Add your company details",
      done: !!settings?.companyName,
      href: "/settings",
      action: "Go to Settings",
      description: "Your name and logo appear on every invoice",
    },
    {
      label: "Set up payment details",
      done: hasPaymentDetails,
      href: "/settings",
      action: "Add Payment Details",
      description: "So clients know how to pay you — auto-fills on invoices",
    },
    {
      label: "Add your first client",
      done: clients.some((c) => !c.deletedAt),
      href: "/clients",
      action: "Add Client",
      description: "You need a client to send invoices",
    },
    {
      label: "Create your first invoice",
      done: invoices.length > 0,
      href: "/invoices/new",
      action: "Create Invoice",
      description: null,
    },
  ];

  const allDone      = steps.every((s) => s.done);
  const completedCount = steps.filter((s) => s.done).length;
  if (allDone) return null;

  const progressPct = (completedCount / steps.length) * 100;

  return (
    <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-blue-900/10 dark:to-indigo-900/5 overflow-hidden mb-2 shadow-card dark:shadow-card-dark">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4.5 hover:bg-blue-50/40 dark:hover:bg-blue-900/15 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse shadow-sm shadow-blue-500/30" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Complete your setup</span>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 border border-blue-100 dark:border-blue-800/50 shadow-sm">
            {completedCount}/{steps.length}
          </span>
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-gray-400" />
          : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="px-6 pb-5 space-y-3">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200/60 dark:bg-gray-700/40 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out-expo shadow-sm shadow-blue-500/20"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 ${
                step.done
                  ? "opacity-60"
                  : "bg-white/60 dark:bg-gray-800/30 border border-white dark:border-gray-800/50"
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                {step.done ? (
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`text-sm ${step.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-700 dark:text-gray-300 font-semibold"}`}>
                    {step.label}
                  </span>
                  {!step.done && step.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
              {!step.done && step.href && (
                <Button asChild size="sm" variant="outline" className="h-7 text-xs shrink-0 shadow-sm">
                  <Link href={step.href}>{step.action}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
