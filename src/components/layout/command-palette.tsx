"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Users, BarChart2, Sparkles, Settings, HelpCircle, FilePlus } from "lucide-react";

const COMMANDS = [
  { id: "dashboard",         label: "Go to Dashboard",         href: "/dashboard",         icon: LayoutDashboard },
  { id: "invoices",          label: "View Invoices",           href: "/invoices",          icon: FileText },
  { id: "new-invoice",       label: "Create Invoice",          href: "/invoices/new",      icon: FilePlus },
  { id: "clients",           label: "View Clients",            href: "/clients",           icon: Users },
  { id: "analytics",         label: "View Analytics",          href: "/analytics",         icon: BarChart2 },
  { id: "ai",                label: "AI Assistant",            href: "/ai",                icon: Sparkles },
  { id: "settings",          label: "Open Settings",           href: "/settings",          icon: Settings },
  { id: "support",           label: "Help & Support",          href: "/support",           icon: HelpCircle },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const execute = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      execute(filtered[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-gray-400">No results found</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => execute(cmd.href)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  i === selectedIndex
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <cmd.icon className="w-4 h-4 shrink-0" />
                {cmd.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
