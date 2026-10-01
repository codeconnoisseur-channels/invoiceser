"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
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
      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="group flex min-h-11 items-center gap-2.5 rounded-xl border border-transparent py-1.5 pl-2 pr-3 transition-all duration-200 hover:border-[#e4dacf] hover:bg-white hover:shadow-sm"
        >
          {/* Avatar */}
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={displayName}
              className="size-8 rounded-lg object-cover ring-2 ring-[#f0e9e1]"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-500 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
          )}
          <span className="hidden max-w-[130px] truncate text-sm font-semibold text-[#4f4943] sm:block">
            {displayName}
          </span>
          {plan && (
            <Badge variant={plan} className="hidden sm:inline-flex">
              {plan === "pro" ? "Pro" : "Free"}
            </Badge>
          )}
          <ChevronDown
            className={`size-3.5 text-[#9a9188] transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-scale-in rounded-2xl border border-[#e4dacf] bg-white py-1 shadow-xl shadow-[#5b4631]/10">
            {/* User info header */}
            <div className="border-b border-[#eee6de] px-4 py-3.5">
              <p className="truncate text-sm font-bold text-[#24211e]">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#817970]">
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
