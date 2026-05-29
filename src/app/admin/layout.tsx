"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Users, Settings, BarChart2, MessageSquare, Megaphone, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Plans & Flags", icon: Settings },
  { href: "/admin/stats", label: "Stats", icon: BarChart2 },
  { href: "/admin/support", label: "Support", icon: MessageSquare },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role;
  if (role !== "platform_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <p className="text-sm font-semibold">Admin Panel</p>
          <p className="text-xs text-gray-400 mt-0.5">Invoiceser</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {adminNav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white">
            ← Back to App
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-gray-25 px-8 py-6">{children}</main>
    </div>
  );
}
