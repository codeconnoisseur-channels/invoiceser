"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradeSuccessPage() {
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const isPro = currentUser?.plan === "pro";
  const loading = currentUser === undefined;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        ) : isPro ? (
          <>
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-5 border border-violet-200 dark:border-violet-800">
              <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              You&apos;re on Pro!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              All Pro features are now unlocked. Welcome to the full Invoiceser experience.
            </p>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Link href="/dashboard">
                <Sparkles className="w-4 h-4" />Go to dashboard
              </Link>
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-800">
              <CheckCircle2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Payment received
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Your payment is being confirmed. Your account will upgrade to Pro within a few seconds — this page updates automatically.
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
