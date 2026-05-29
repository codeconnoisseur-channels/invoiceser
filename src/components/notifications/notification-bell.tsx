"use client";

import { useState } from "react";
import { Bell, X, CheckCheck, Eye, AlertTriangle, DollarSign, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

type NotifType = "invoice_viewed" | "invoice_overdue" | "payment_recorded" | "invoice_paid";

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactNode; dot: string; label: string }> = {
  invoice_viewed:   { icon: <Eye className="w-4 h-4 text-blue-500" />,        dot: "bg-blue-500",    label: "Invoice viewed" },
  invoice_overdue:  { icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, dot: "bg-rose-500", label: "Overdue" },
  payment_recorded: { icon: <DollarSign className="w-4 h-4 text-emerald-500" />, dot: "bg-emerald-500", label: "Payment" },
  invoice_paid:     { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, dot: "bg-emerald-500", label: "Paid" },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const notifications = useQuery(api.notifications.getNotifications);
  const unreadCount   = useQuery(api.notifications.getUnreadCount);
  const markAllRead   = useMutation(api.notifications.markAllRead);
  const markRead      = useMutation(api.notifications.markRead);

  const hasUnread = unreadCount != null && unreadCount > 0;

  return (
    <>
      {/* Bell trigger */}
      <button
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary-500 text-[10px] text-white flex items-center justify-center font-bold px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 dark:bg-black/50 z-[60] backdrop-blur-[2px] transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[420px] max-w-[95vw] z-[70] flex flex-col",
          "bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200 dark:border-gray-800",
          "transition-transform duration-300 ease-spring",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Notifications panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {hasUnread ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 gap-1.5 text-gray-500"
                onClick={() => markAllRead()}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5 border border-gray-200 dark:border-gray-700">
                <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Nothing yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                You&apos;ll see updates here when clients view invoices, payments are recorded, or invoices go overdue.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => {
                const config = TYPE_CONFIG[n.type as NotifType] ?? {
                  icon: <Bell className="w-4 h-4 text-gray-400" />,
                  dot: "bg-gray-400",
                  label: "Notification",
                };
                return (
                  <div
                    key={n._id}
                    className={cn(
                      "flex gap-4 px-5 py-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors group",
                      !n.read
                        ? "bg-blue-50/40 dark:bg-blue-900/10 hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
                        : "hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    )}
                  >
                    {/* Icon */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        {config.icon}
                      </div>
                      {!n.read && (
                        <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-950 ${config.dot}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-relaxed",
                          !n.read ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-600 dark:text-gray-400"
                        )}>
                          {n.message}
                        </p>
                        {!n.read && (
                          <button
                            onClick={() => markRead({ notificationId: n._id as Id<"notifications"> })}
                            className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5">
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Showing last {notifications?.length ?? 0} notifications
          </p>
        </div>
      </div>
    </>
  );
}
