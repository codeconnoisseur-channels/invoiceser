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
    <div className="flex flex-col gap-3 border-t border-[#eee6de] px-3 py-4">
      {showUpgrade && (
        <button
          onClick={() => setUpgradeOpen(true)}
          className="group flex w-full items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-3.5 py-3 transition-all duration-200 hover:border-primary-200 hover:bg-orange-100"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-500 shadow-sm transition-shadow group-hover:shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-primary-700">Upgrade to Pro</p>
            <p className="truncate text-[10px] text-primary-600">Unlock all features</p>
          </div>
        </button>
      )}
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      {/* Notifications */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a9188]">Notifications</span>
        <NotificationBell />
      </div>
    </div>
  );
}
