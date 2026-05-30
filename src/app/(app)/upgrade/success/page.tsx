"use client";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Sparkles, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams     = useSearchParams();
  const reference        = searchParams.get("reference");

  const currentUser      = useQuery(api.users.getCurrentUserQuery);
  const verifyPayment    = useAction(api.payments.verifyKorapayAndUpgrade);

  const isPro            = currentUser?.plan === "pro";
  const loading          = currentUser === undefined;

  const [verifying,    setVerifying]    = useState(false);
  const [verifyError,  setVerifyError]  = useState<string | null>(null);
  const didVerify        = useRef(false);

  useEffect(() => {
    if (loading || isPro || didVerify.current || !reference) return;
    didVerify.current = true;

    async function verify() {
      setVerifying(true);
      setVerifyError(null);
      try {
        await verifyPayment({ reference: reference! });
        // Convex reactive query will auto-update isPro — no manual refresh needed
      } catch (err) {
        setVerifyError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [loading, isPro, reference, verifyPayment]);

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

        ) : verifying ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-violet-500 mx-auto mb-5" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Confirming your payment…
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verifying with our payment provider. This only takes a moment.
            </p>
          </>

        ) : verifyError ? (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Payment verification issue
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              We received your payment but could not automatically confirm it. Your account may still upgrade within a minute — please refresh this page.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              If the issue persists, contact support with your payment reference: <span className="font-mono font-bold">{reference ?? "—"}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.location.reload()}>Refresh page</Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </>

        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-800">
              <CheckCircle2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Payment received
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {reference
                ? "Verifying your payment now — your account will upgrade automatically."
                : "Your payment is being confirmed. Your account will upgrade to Pro shortly."}
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
