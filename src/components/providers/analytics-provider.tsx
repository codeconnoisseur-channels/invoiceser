"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, identifyUser, captureEvent, resetAnalytics } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        identifyUser(
          user.id,
          user.primaryEmailAddress?.emailAddress ?? "",
          user.fullName ?? undefined,
        );
      } else {
        resetAnalytics();
      }
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (pathname) {
      captureEvent("$pageview", {
        path: pathname,
        search: searchParams?.toString() ?? "",
      });
    }
  }, [pathname, searchParams]);

  return children;
}
