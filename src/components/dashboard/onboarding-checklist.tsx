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

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-900/10 overflow-hidden mb-2">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Complete your setup</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-full px-2.5 py-0.5 border border-gray-200 dark:border-gray-700">
            {completedCount}/{steps.length} done
          </span>
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-gray-400" />
          : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-2.5">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.label} className="flex items-center justify-between py-1">
              <div className="flex items-start gap-3">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`text-sm ${step.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-700 dark:text-gray-300 font-medium"}`}>
                    {step.label}
                  </span>
                  {!step.done && step.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
              {!step.done && step.href && (
                <Button asChild size="sm" variant="outline" className="h-7 text-xs shrink-0">
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
