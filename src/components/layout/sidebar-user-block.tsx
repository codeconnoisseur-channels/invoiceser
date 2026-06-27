"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/upgrade-modal";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function SidebarUserBlock() {
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Persist last known plan so any brief undefined state during navigation
  // never flashes the badge or upgrade button back to the "Free" fallback.
  const lastKnownPlan = useRef<"free" | "pro" | undefined>(undefined);
  if (currentUser?.plan !== undefined) lastKnownPlan.current = currentUser.plan;
  const plan = lastKnownPlan.current;

  const showUpgrade = plan === "free";

  return (
    <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
      {showUpgrade && (
        <button
          onClick={() => setUpgradeOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/50 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm shadow-violet-500/20 group-hover:shadow-md group-hover:shadow-violet-500/25 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Upgrade to Pro</p>
            <p className="text-[10px] text-violet-500 dark:text-violet-400 truncate">Unlock all features</p>
          </div>
        </button>
      )}
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      {/* Notifications */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em]">Notifications</span>
        <NotificationBell />
      </div>
    </div>
  );
}
