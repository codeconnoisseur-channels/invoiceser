"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlertTriangle, Info, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  info: {
    icon: Info,
    classes: "bg-primary-50 border-primary-100 text-primary-700",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-warning-50 border-warning-100 text-warning-700",
  },
  maintenance: {
    icon: Wrench,
    classes: "bg-danger-50 border-danger-100 text-danger-700",
  },
};

export function AnnouncementBanner() {
  const announcements = useQuery(api.admin.getAnnouncements);

  if (!announcements || announcements.length === 0) return null;

  const announcement = announcements[0];
  const config = typeConfig[announcement.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-8 py-2.5 border-b text-sm",
        config.classes
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{announcement.message}</span>
    </div>
  );
}
