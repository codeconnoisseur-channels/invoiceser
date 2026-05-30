"use client";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const reference      = searchParams.get("reference");

  const currentUser    = useQuery(api.users.getCurrentUserQuery);
  const upgradeToPro   = useMutation(api.users.selfUpgradeToPro);

  const isPro   = currentUser?.plan === "pro";
  const loading = currentUser === undefined;

  const didUpgrade = useRef(false);
  const [upgrading,       setUpgrading]       = useState(false);
  const [waitingForPro,   setWaitingForPro]   = useState(false);
  const [failed,          setFailed]          = useState(false);

  // Step 1: run the upgrade mutation once, after user record loads
  useEffect(() => {
    if (loading || isPro || didUpgrade.current || !reference) return;
    didUpgrade.current = true;
    setUpgrading(true);
    upgradeToPro({})
      .then(() => setWaitingForPro(true))
      .catch(() => setFailed(true))
      .finally(() => setUpgrading(false));
  }, [loading, isPro, reference, upgradeToPro]);

  // Step 2: if mutation resolved but the reactive query hasn't confirmed Pro after 8s, surface an error
  useEffect(() => {
    if (!waitingForPro || isPro) return;
    const t = setTimeout(() => setFailed(true), 8000);
    return () => clearTimeout(t);
  }, [waitingForPro, isPro]);

  // Step 3: only redirect once Convex confirms plan === "pro"
  useEffect(() => {
    if (!isPro) return;
    const t = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(t);
  }, [isPro, router]);

  function retry() {
    didUpgrade.current = false;
    setFailed(false);
    setWaitingForPro(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">

        {/* Loading user / running mutation */}
        {(loading || upgrading) && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-violet-500 mx-auto mb-5" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Activating your Pro plan…
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Just a moment.</p>
          </>
        )}

        {/* Mutation resolved — waiting for Convex reactive confirmation */}
        {!loading && !upgrading && waitingForPro && !isPro && !failed && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-violet-500 mx-auto mb-5" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Confirming your upgrade…
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Almost there.</p>
          </>
        )}

        {/* Confirmed Pro by reactive query */}
        {isPro && (
          <>
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-5 border border-violet-200 dark:border-violet-800">
              <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              You&apos;re on Pro!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              All Pro features are now unlocked. Welcome to the full Invoiceser experience.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
              Taking you to your dashboard…
            </p>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Link href="/dashboard">
                <Sparkles className="w-4 h-4" />Go to dashboard
              </Link>
            </Button>
          </>
        )}

        {/* Error state */}
        {failed && !isPro && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your payment was received, but we couldn&apos;t activate Pro automatically.
              Please try again or contact support with your reference:{" "}
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{reference}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={retry}
              >
                Try again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/support">Contact support</Link>
              </Button>
            </div>
          </>
        )}

        {/* No reference param — user navigated here directly */}
        {!reference && !loading && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Confirming your payment…
            </p>
          </>
        )}

      </div>
    </div>
  );
}
