"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const SidebarUserBlock = dynamic(
  () => import("./sidebar-user-block").then((m) => m.SidebarUserBlock),
  { ssr: false }
);

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients",   label: "Clients",   icon: Users         },
  { href: "/invoices",  label: "Invoices",  icon: FileText      },
  { href: "/analytics", label: "Analytics", icon: BarChart2     },
  { href: "/ai",        label: "AI",        icon: Sparkles      },
];

const accountItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Help & Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-md">Invoiceser</span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary-50 dark:bg-blue-900/25 text-primary-700 dark:text-blue-400 font-medium border-l-2 border-primary-500 dark:border-blue-500 pl-[10px]"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-3 pb-1">
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        {accountItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary-50 dark:bg-blue-900/25 text-primary-700 dark:text-blue-400 font-medium border-l-2 border-primary-500 dark:border-blue-500 pl-[10px]"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User block — dynamic to avoid Clerk SSR hydration mismatch */}
      <SidebarUserBlock />
    </aside>
  );
}
