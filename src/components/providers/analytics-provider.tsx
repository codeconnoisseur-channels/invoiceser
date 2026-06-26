"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, identifyUser, captureEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (user) {
      identifyUser(
        user.id,
        user.primaryEmailAddress?.emailAddress ?? "",
        user.fullName ?? undefined,
      );
    }
  }, [user]);

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
