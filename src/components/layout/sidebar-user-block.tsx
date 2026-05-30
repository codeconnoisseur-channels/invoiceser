"use client";

import { useState, useRef } from "react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LogOut, Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/upgrade-modal";

export function SidebarUserBlock() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Persist last known plan so any brief undefined state during navigation
  // never flashes the badge or upgrade button back to the "Free" fallback.
  const lastKnownPlan = useRef<"free" | "pro" | undefined>(undefined);
  if (currentUser?.plan !== undefined) lastKnownPlan.current = currentUser.plan;
  const plan = lastKnownPlan.current;

  const isPro = plan === "pro";
  const showUpgrade = plan === "free";

  return (
    <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
      {showUpgrade && (
        <button
          onClick={() => setUpgradeOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors group"
        >
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Upgrade to Pro</p>
            <p className="text-[10px] text-violet-500 dark:text-violet-500 truncate">Unlock all features</p>
          </div>
        </button>
      )}
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      {/* Notification + theme row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Notifications</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>

      {/* User row */}
      <div className="flex items-center gap-2">
        <UserButton afterSignOutUrl="/sign-in" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
          </p>
          {plan && (
            <Badge variant={plan} className="mt-0.5">
              {plan === "pro" ? "Pro" : "Free"}
            </Badge>
          )}
        </div>
        <SignOutButton>
          <button
            className="p-1.5 rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
