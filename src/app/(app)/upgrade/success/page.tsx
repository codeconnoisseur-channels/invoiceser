"use client";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Sparkles, Loader2 } from "lucide-react";
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
  const searchParams = useSearchParams();
  const router       = useRouter();
  const reference    = searchParams.get("reference");

  const currentUser  = useQuery(api.users.getCurrentUserQuery);
  const upgradeToPro = useMutation(api.users.selfUpgradeToPro);

  const isPro  = currentUser?.plan === "pro";
  const loading = currentUser === undefined;

  const didUpgrade = useRef(false);
  const [upgrading, setUpgrading] = useState(false);
  const [done,      setDone]      = useState(false);

  // KoraPay only ever redirects to this URL on a successful payment,
  // so receiving a reference param is sufficient proof — upgrade immediately.
  useEffect(() => {
    if (loading || isPro || didUpgrade.current || !reference) return;
    didUpgrade.current = true;
    setUpgrading(true);
    upgradeToPro({})
      .then(() => setDone(true))
      .catch(() => setDone(true)) // treat any error as "try again from reactive query"
      .finally(() => setUpgrading(false));
  }, [loading, isPro, reference, upgradeToPro]);

  // Once Pro is confirmed, redirect to dashboard after 3 seconds
  useEffect(() => {
    if (!isPro && !done) return;
    const t = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(t);
  }, [isPro, done, router]);

  const showSuccess = isPro || done;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm mx-auto">

        {loading || upgrading ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-violet-500 mx-auto mb-5" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Activating your Pro plan…
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Just a moment.
            </p>
          </>

        ) : showSuccess ? (
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

        ) : (
          // reference not in URL — rare, only if user navigates here directly
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
