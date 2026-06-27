"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { LogOut, ChevronDown } from "lucide-react";

export function TopBarUserMenu() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Persist last known plan so any brief undefined state during navigation
  // never flashes the badge or upgrade button back to the "Free" fallback.
  const lastKnownPlan = useRef<"free" | "pro" | undefined>(undefined);
  if (currentUser?.plan !== undefined) lastKnownPlan.current = currentUser.plan;
  const plan = lastKnownPlan.current;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
      : user?.emailAddresses[0]?.emailAddress ?? "Account";

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <div className="flex items-center gap-1.5">
      {/* Theme toggle */}
      <ThemeToggle />

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
        >
          {/* Avatar */}
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={displayName}
              className="w-8 h-8 rounded-lg ring-2 ring-gray-100 dark:ring-gray-800 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
          )}
          <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[130px] truncate">
            {displayName}
          </span>
          {plan && (
            <Badge variant={plan} className="hidden sm:inline-flex">
              {plan === "pro" ? "Pro" : "Free"}
            </Badge>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-black/40 py-1 z-50 animate-scale-in origin-top-right">
            {/* User info header */}
            <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              {plan && (
                <Badge variant={plan} className="mt-2">
                  {plan === "pro" ? "Pro Plan" : "Free Plan"}
                </Badge>
              )}
            </div>

            {/* Sign out */}
            <div className="py-1.5 px-1.5">
              <SignOutButton>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
