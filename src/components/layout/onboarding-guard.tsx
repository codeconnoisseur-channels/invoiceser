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
    if (settings === undefined) return;
    if (settings === null) {
      router.replace("/onboarding");
      return;
    }
    if (!settings.companyName) {
      router.replace("/onboarding");
    }
  }, [settings, pathname, router]);

  if (settings === undefined && pathname !== "/onboarding") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
