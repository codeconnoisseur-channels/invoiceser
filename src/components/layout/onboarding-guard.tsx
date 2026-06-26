"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const settings = useQuery(api.settings.getSettings);

  useEffect(() => {
    if (pathname === "/onboarding") return;
    if (typeof window !== "undefined" && localStorage.getItem("onboarding_dismissed")) return;
    if (settings === undefined) return;
    if (settings === null) {
      router.replace("/onboarding");
      return;
    }
    if (!settings.companyName) {
      router.replace("/onboarding");
    }
  }, [settings, pathname, router]);

  return <>{children}</>;
}
