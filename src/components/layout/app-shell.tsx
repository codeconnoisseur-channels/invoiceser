"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, FileText, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BarChart2, Sparkles, Settings, HelpCircle,
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
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 scrollbar-thin">
      <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a9188]">Workspace</p>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100"
                : "text-[#6f675f] hover:bg-[#f7f1ea] hover:text-[#24211e]"
            )}
          >
            <item.icon className={cn("size-[18px] shrink-0 transition-colors", active ? "text-primary-500" : "text-[#aaa198] group-hover:text-[#6f675f]")} />
            {item.label}
          </Link>
        );
      })}

      <div className="pb-1 pt-5">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a9188]">Account</p>
      </div>

      {accountItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100"
                : "text-[#6f675f] hover:bg-[#f7f1ea] hover:text-[#24211e]"
            )}
          >
            <item.icon className={cn("size-[18px] shrink-0 transition-colors", active ? "text-primary-500" : "text-[#aaa198] group-hover:text-[#6f675f]")} />
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
    <div className="app-workspace flex min-h-screen text-[#24211e]">
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[244px] flex-col border-r border-[#e9e1d8] bg-white/95 backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div className="px-5 pb-5 pt-6">
          <Logo />
        </div>
        <NavLinks />
        <SidebarUserBlock />
      </aside>

      {/* ── Mobile overlay ───────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#24211e]/35 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer sidebar ─────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-[#e9e1d8] bg-white transition-transform duration-300 ease-spring lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-5 py-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="flex size-10 items-center justify-center rounded-xl text-[#756d65] transition-colors hover:bg-[#f3ede6] hover:text-[#24211e]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks onNav={() => setOpen(false)} />
        <SidebarUserBlock />
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex min-h-screen flex-1 flex-col lg:ml-[244px]">
        {/* Desktop top bar */}
        <div className="sticky top-0 z-30 hidden min-h-16 items-center justify-end gap-2 border-b border-[#e9e1d8]/80 bg-[#faf7f3]/85 px-8 backdrop-blur-xl lg:flex">
          <button onClick={() => setCmdPaletteOpen(true)} aria-label="Open command palette" className="flex size-10 items-center justify-center rounded-xl border border-[#e4dacf] bg-white text-[#817970] shadow-sm transition-colors hover:border-primary-200 hover:text-primary-600">
            <Search className="size-4" />
          </button>
          <TopBarUserMenu />
        </div>

        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-[#e9e1d8] bg-white/90 px-4 shadow-sm backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="flex size-10 items-center justify-center rounded-xl text-[#756d65] transition-colors hover:bg-[#f3ede6] hover:text-[#24211e]"
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
