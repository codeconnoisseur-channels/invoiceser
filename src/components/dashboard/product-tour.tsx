"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, FilePlus, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOUR_KEY = "invoiceser_tour_dismissed";

const steps = [
  {
    title: "Welcome to Invoiceser!",
    body: "Let's get you started. Here are the key places you'll use every day.",
    icon: null,
  },
  {
    title: "Create your first invoice",
    body: "Click here to create and send your first invoice to a client.",
    icon: <FilePlus className="w-5 h-5" />,
    highlight: "new-invoice-btn",
  },
  {
    title: "Add your clients",
    body: "Manage your client list — add businesses and individuals you invoice.",
    icon: <Users className="w-5 h-5" />,
    highlight: "nav-clients",
  },
  {
    title: "Set up your brand",
    body: "Customise your business name, logo, colours, and payment details.",
    icon: <Settings className="w-5 h-5" />,
    highlight: "nav-settings",
  },
];

export function ProductTour({ hasInvoices }: { hasInvoices: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (hasInvoices) return;
    const dismissed = localStorage.getItem(TOUR_KEY);
    if (!dismissed) setOpen(true);
  }, [hasInvoices]);

  function dismiss() {
    localStorage.setItem(TOUR_KEY, "1");
    setOpen(false);
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  if (!open) return null;

  const s = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>

        {s.icon && (
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
            {s.icon}
          </div>
        )}

        <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-1">
          {s.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {s.body}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step
                    ? "bg-violet-600 dark:bg-violet-400"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <Button size="sm" onClick={next} className="gap-1.5">
            {step < steps.length - 1 ? "Next" : "Got it"}
            {step < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
