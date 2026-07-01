"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, FileText } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BarChart2, Sparkles, Settings, HelpCircle, Receipt,
} from "lucide-react";
import dynamic from "next/dynamic";

const SidebarUserBlock = dynamic(
  () => import("./sidebar-user-block").then((m) => m.SidebarUserBlock),
  { ssr: false }
);

const TopBarUserMenu = dynamic(
  () => import("./top-bar-user-menu").then((m) => m.TopBarUserMenu),
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
    <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-1">
      <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em]">Menu</p>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <item.icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
            {item.label}
          </Link>
        );
      })}

      <div className="pt-5 pb-2">
        <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em]">Account</p>
      </div>

      {accountItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <item.icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Cmd+K global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[250px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-6">
          <Logo />
        </div>
        <NavLinks />
        <SidebarUserBlock />
      </aside>

      {/* ── Mobile overlay ───────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
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
        <div className="px-5 py-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks onNav={() => setOpen(false)} />
        <SidebarUserBlock />
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1 lg:ml-[250px] min-h-screen flex flex-col">
        {/* Desktop top bar */}
        <div className="hidden lg:flex sticky top-0 z-30 items-center justify-end px-8 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
          <TopBarUserMenu />
        </div>

        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo textClassName="text-sm" />
          <div className="ml-auto">
            <TopBarUserMenu />
          </div>
        </div>

        {children}
      </main>

      {cmdPaletteOpen && <CommandPalette onClose={() => setCmdPaletteOpen(false)} />}
    </div>
  );
}
