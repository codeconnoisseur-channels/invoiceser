"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import {
  FileText, Clock, CheckCircle2, FilePlus, ArrowRight, Wallet, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { ProductTour } from "@/components/dashboard/product-tour";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function StatCard({
  label, value, sub, icon,
}: {
  label: string;
  value: string | null;
  sub: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
          {icon}
        </div>
      </div>
      {value === null ? (
        <>
          <Skeleton className="h-9 w-28 mb-1.5" />
          <Skeleton className="h-3 w-20" />
        </>
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{sub}</p>}
        </>
      )}
    </div>
  );
}

function getCurrencySymbol(code: string) {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export default function DashboardPage() {
  const { user: clerkUser } = useUser();
  const stats          = useQuery(api.invoices.getDashboardStats);
  const attentionList  = useQuery(api.invoices.getAttentionList);
  const recentInvoices = useQuery(api.invoices.getRecentInvoices);
  const wallet         = useQuery(api.invoices.getWalletSummary);
  const settings       = useQuery(api.settings.getSettings);
  const touchUser      = useMutation(api.users.touchUser);

  useEffect(() => { touchUser(); }, [touchUser]);

  const currency  = settings?.defaultCurrency ?? "GBP";
  const firstName = settings?.displayName
    ?? clerkUser?.firstName
    ?? clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0]
    ?? "there";

  const pendingSubText = stats
    ? (stats.pendingCount ?? 0) > 0
      ? `${stats.pendingCount} invoice${stats.pendingCount !== 1 ? "s" : ""} outstanding`
      : "Nothing outstanding"
    : null;

  const hasInvoices = (stats?.totalCount ?? 0) > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getTodayLabel()}</p>
        </div>
        {hasInvoices && (
          <Button asChild className="gap-2">
            <Link href="/invoices/new">
              <FilePlus className="w-4 h-4" />New Invoice
            </Link>
          </Button>
        )}
      </div>

      <ProductTour hasInvoices={hasInvoices} />

      {!hasInvoices && stats ? (
        /* ── Empty state: guide, not zeros ── */
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-blue-200 dark:border-blue-700">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Ready to send your first invoice?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Add a client, set your rates, and send a professional invoice in under a minute.
          </p>
          <Button asChild className="h-11 gap-2 text-base">
            <Link href="/invoices/new">
              <FilePlus className="w-4 h-4" />Create Your First Invoice
            </Link>
          </Button>
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">Quick start guide</p>
            <div className="grid grid-cols-3 gap-4 text-left">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">1</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add your first client</p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">2</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create an invoice</p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">3</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send & get paid</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <OnboardingChecklist />

          {/* 3 Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Invoices"
              value={stats ? String(stats.totalCount) : null}
              sub="sent, pending & paid"
              icon={<FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            />
            <StatCard
              label="Awaiting Payment"
              value={stats ? formatCurrency(stats.totalPending, currency) : null}
              sub={`${pendingSubText ?? ""} · shown in ${currency}`}
              icon={<Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            />
            <StatCard
              label="Total Collected"
              value={stats ? formatCurrency(stats.totalPaid, currency) : null}
              sub={`all paid invoices · shown in ${currency}`}
              icon={<CheckCircle2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            />
          </div>

          {/* Wallet panel */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Earnings by Currency</h2>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Actual amounts per currency · no conversion. Stat cards above show totals in {currency}.
            </p>
            {wallet === undefined ? (
              <div className="grid grid-cols-2 gap-3">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
            ) : wallet.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No earnings yet — send your first invoice to get started.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {wallet.map((row) => {
                  const sym = getCurrencySymbol(row.currency);
                  const fmt = (n: number) => `${sym}${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  const hasPending = row.pending > 0;
                  return (
                    <div key={row.currency} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase">{row.currency}</span>
                        {hasPending && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                            {row.pendingCount} pending
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-black text-gray-900 dark:text-gray-100 tabular-nums leading-none">
                        {fmt(row.collected)}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">collected</p>
                      {hasPending && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">{fmt(row.pending)}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">awaiting payment</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main tables */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Action Required */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Action Required</h2>
                {attentionList && attentionList.length > 0 && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-rose-800">
                    {attentionList.length} item{attentionList.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                {attentionList === undefined ? (
                  <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
                ) : attentionList.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100 dark:border-emerald-800">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">All caught up!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No invoices need your attention</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Invoice</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Due</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attentionList.slice(0, 8).map((inv) => (
                        <tr
                          key={inv._id}
                          onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                          className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                            inv.status === "overdue"
                              ? "bg-rose-50/40 dark:bg-rose-900/10 hover:bg-rose-50/70 dark:hover:bg-rose-900/20"
                              : "hover:bg-blue-50/20 dark:hover:bg-blue-900/10"
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${inv.status === "overdue" ? "bg-rose-500" : "bg-amber-400"}`} />
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{inv.clientSnapshot.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100 text-right">{formatCurrency(inv.total, inv.currency)}</td>
                          <td className={`px-4 py-3.5 text-sm font-medium ${inv.status === "overdue" ? "text-rose-600 dark:text-rose-400" : "text-gray-600 dark:text-gray-400"}`}>
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={inv.status as "sent" | "overdue"}>
                              {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Recent Invoices</h2>
                <Link href="/invoices" className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                {recentInvoices === undefined ? (
                  <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : recentInvoices.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200 dark:border-gray-700">
                      <FileText className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
                    <Link href="/invoices/new" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">
                      Create your first →
                    </Link>
                  </div>
                ) : (
                  <div>
                    {recentInvoices.map((inv) => (
                      <Link
                        key={inv._id}
                        href={`/invoices/${inv._id}`}
                        className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xs font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                          {inv.clientSnapshot.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{inv.clientSnapshot.fullName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</p>
                          <Badge variant={inv.status as "draft" | "sent" | "paid" | "overdue" | "voided"} className="mt-0.5 text-[10px]">
                            {inv.status === "voided" ? "Cancelled" : inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
