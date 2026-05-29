"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BarChart2, Sparkles, Settings, HelpCircle,
} from "lucide-react";
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
  { href: "/settings", label: "Settings",      icon: Settings   },
  { href: "/support",  label: "Help & Support", icon: HelpCircle },
];

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
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
            onClick={onNav}
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
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-40">
        <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-md">Invoiceser</span>
          </Link>
        </div>
        <NavLinks />
        <SidebarUserBlock />
      </aside>

      {/* ── Mobile overlay ───────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer sidebar ─────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 ease-spring lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-md">Invoiceser</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks onNav={() => setOpen(false)} />
        <SidebarUserBlock />
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Invoiceser</span>
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}
