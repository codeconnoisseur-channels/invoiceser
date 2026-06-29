"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlertCircle, ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SettingsNotice() {
  const settings = useQuery(api.settings.getSettings);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = !!localStorage.getItem("settings_notice_dismissed");
      if (!dismissed) {
        setHasChecked(true);
      }
    }
  }, []);

  useEffect(() => {
    if (
      hasChecked &&
      settings &&
      pathname !== "/settings" &&
      pathname !== "/onboarding"
    ) {
      const isMissingDetails =
        !settings.paymentAccounts || settings.paymentAccounts.length === 0;

      if (isMissingDetails) {
        setOpen(true);
      }
    }
  }, [hasChecked, settings, pathname]);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("settings_notice_dismissed", "1");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) dismiss();
    }}>
      <DialogContent className="sm:max-w-md border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50 dark:ring-blue-950">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">How do you want to get paid?</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You haven&apos;t added any payment details yet. Add your bank account or payment links so clients know how to pay your invoices.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-3 mt-4">
          <Button asChild className="w-full gap-2 h-11 text-base shadow-md">
            <Link href="/settings" onClick={dismiss}>
              Add Payment Details <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" onClick={dismiss} className="w-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            I&apos;ll do this later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
