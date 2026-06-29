"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import {
  FileText, Clock, CheckCircle2, FilePlus, ArrowRight, Wallet, Info,
  TrendingUp, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { ProductTour } from "@/components/dashboard/product-tour";
import { SettingsNotice } from "@/components/dashboard/settings-notice";

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

const STAT_THEMES = {
  blue:    { cardBg: "bg-blue-50/60 dark:bg-blue-950/30",   border: "border-l-blue-500",   iconBg: "bg-blue-500",  iconColor: "text-white",  labelColor: "text-blue-700 dark:text-blue-300",  valColor: "text-blue-900 dark:text-blue-50" },
  amber:   { cardBg: "bg-amber-50/60 dark:bg-amber-950/30", border: "border-l-amber-500",  iconBg: "bg-amber-500", iconColor: "text-white",  labelColor: "text-amber-700 dark:text-amber-300", valColor: "text-amber-900 dark:text-amber-50" },
  emerald: { cardBg: "bg-emerald-50/60 dark:bg-emerald-950/30", border: "border-l-emerald-500", iconBg: "bg-emerald-500", iconColor: "text-white", labelColor: "text-emerald-700 dark:text-emerald-300", valColor: "text-emerald-900 dark:text-emerald-50" },
} as const;

function StatCard({
  label, value, sub, icon, theme,
}: {
  label: string;
  value: string | null;
  sub: string | null;
  icon: React.ReactNode;
  theme: keyof typeof STAT_THEMES;
}) {
  const t = STAT_THEMES[theme];
  return (
    <div className={`rounded-2xl ${t.cardBg} border border-gray-200/50 dark:border-gray-800 border-l-4 ${t.border} shadow-card dark:shadow-card-dark p-6 card-hover`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-[11px] font-bold ${t.labelColor} uppercase tracking-widest`}>{label}</p>
        <div className={`w-10 h-10 rounded-xl ${t.iconBg} flex items-center justify-center shadow-md`}>
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
          <p className={`text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold ${t.valColor} tracking-tight tabular-nums`}>{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{sub}</p>}
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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center ring-1 ring-primary-200 dark:ring-primary-800 mt-0.5 shrink-0">
            <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 font-medium">{getTodayLabel()}</p>
          </div>
        </div>
        {hasInvoices && (
          <Button asChild className="gap-2 shadow-md">
            <Link href="/invoices/new">
              <FilePlus className="w-4 h-4" />New Invoice
            </Link>
          </Button>
        )}
      </div>

      <ProductTour hasInvoices={hasInvoices} />
      <SettingsNotice />

      {!hasInvoices && stats ? (
        /* ── Empty state: guide, not zeros ── */
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 shadow-card dark:shadow-card-dark p-14 text-center max-w-lg mx-auto animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-200/50 dark:ring-blue-700/30">
            <FileText className="w-9 h-9 text-blue-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Ready to send your first invoice?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
            Add a client, set your rates, and send a professional invoice in under a minute.
          </p>
          <Button asChild className="h-11 gap-2 text-base shadow-md shadow-primary-500/20">
            <Link href="/invoices/new">
              <FilePlus className="w-4 h-4" />Create Your First Invoice
            </Link>
          </Button>
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em] mb-5">Quick start guide</p>
            <div className="grid grid-cols-3 gap-4 text-left">
              {[
                { num: "1", text: "Add your first client" },
                { num: "2", text: "Create an invoice" },
                { num: "3", text: "Send & get paid" },
              ].map((step) => (
                <div key={step.num} className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200/70 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold mb-2.5 shadow-sm shadow-primary-500/20">
                    {step.num}
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <OnboardingChecklist />

          {/* 3 Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              label="Total Invoices"
              value={stats ? String(stats.totalCount) : null}
              sub="sent, pending & paid"
              icon={<FileText className="w-5 h-5 text-white" />}
              theme="blue"
            />
            <StatCard
              label="Awaiting Payment"
              value={stats ? formatCurrency(stats.totalPending, currency) : null}
              sub={pendingSubText ?? ""}
              icon={<Clock className="w-5 h-5 text-white" />}
              theme="amber"
            />
            <StatCard
              label="Total Collected"
              value={stats ? formatCurrency(stats.totalPaid, currency) : null}
              sub={`all paid invoices`}
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              theme="emerald"
            />
          </div>

          {/* Wallet panel */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 shadow-card dark:shadow-card-dark overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-violet-50/70 dark:bg-violet-950/30 border-b border-violet-100 dark:border-violet-900/30">
              <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-md">
                <Wallet className="w-4.5 h-4.5 text-white" />
              </div>
              <h2 className="text-sm font-bold text-violet-800 dark:text-violet-200">Earnings by Currency</h2>
            </div>
            <div className="p-6">
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
                      <div key={row.currency} className="rounded-xl border border-gray-200/70 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-md uppercase shadow-sm">{row.currency}</span>
                          {hasPending && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-800/50">
                              {row.pendingCount} pending
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums leading-none">
                          {fmt(row.collected)}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">collected</p>
                        {hasPending && (
                          <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">{fmt(row.pending)}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">awaiting payment</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main tables */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Action Required */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/30">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shadow-md">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-rose-800 dark:text-rose-200">Action Required</h2>
                  {attentionList && attentionList.length > 0 && (
                    <span className="ml-auto text-[10px] font-bold text-white bg-rose-500 px-2.5 py-1 rounded-full shadow-sm">
                      {attentionList.length} item{attentionList.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {attentionList === undefined ? (
                  <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
                ) : attentionList.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/15 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-200/50 dark:ring-emerald-700/30">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">All caught up!</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No invoices need your attention</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50">
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">Client</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">Invoice</th>
                        <th className="text-right px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">Amount</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">Due</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attentionList.slice(0, 8).map((inv) => (
                        <tr
                          key={inv._id}
                          onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                          className={`border-b border-gray-50 dark:border-gray-800/50 cursor-pointer transition-all duration-200 group ${
                            inv.status === "overdue"
                              ? "bg-rose-50/30 dark:bg-rose-900/5 hover:bg-rose-50/60 dark:hover:bg-rose-900/10"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${inv.status === "overdue" ? "bg-rose-500 animate-pulse" : "bg-amber-400"}`} />
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{inv.clientSnapshot.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-bold tracking-wider text-primary-600 dark:text-primary-400">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100 text-right">{formatCurrency(inv.total, inv.currency)}</td>
                          <td className={`px-4 py-3.5 text-sm font-medium ${inv.status === "overdue" ? "text-rose-600 dark:text-rose-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <Badge variant={inv.status as "sent" | "overdue"}>
                                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                              </Badge>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
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
              <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-primary-50/70 dark:bg-primary-950/30 border-b border-primary-100 dark:border-primary-900/30">
                  <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-md">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-primary-800 dark:text-primary-200">Recent Invoices</h2>
                  <Link href="/invoices" className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                {recentInvoices === undefined ? (
                  <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : recentInvoices.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-gray-200/50 dark:ring-gray-700/30">
                      <FileText className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No invoices yet</p>
                    <Link href="/invoices/new" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline mt-1.5 inline-block">
                      Create your first →
                    </Link>
                  </div>
                ) : (
                  <div>
                    {recentInvoices.map((inv) => (
                      <Link
                        key={inv._id}
                        href={`/invoices/${inv._id}`}
                        className="group flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-all duration-200 last:border-0"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500 dark:text-gray-400 ring-1 ring-gray-200/50 dark:ring-gray-700/30">
                          {inv.clientSnapshot.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold tracking-wider text-primary-600 dark:text-primary-400">{inv.invoiceNumber}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{inv.clientSnapshot.fullName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</p>
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
