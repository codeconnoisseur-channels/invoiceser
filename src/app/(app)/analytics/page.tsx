"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { BarChart2, TrendingUp, TrendingDown, Sparkles, AlertTriangle, CalendarCheck } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade-modal";

type Range     = "30d" | "90d" | "365d" | "all";
type ChartType = "bar" | "line";

const STATUS_COLORS: Record<string, string> = {
  draft:   "#D1D5DB",
  sent:    "#3B82F6",
  paid:    "#22C55E",
  overdue: "#F59E0B",
};

function calcTrend(current: number, prev: number): { pct: number; up: boolean } | null {
  if (prev === 0) return current > 0 ? { pct: 100, up: true } : null;
  const pct = Math.round(((current - prev) / prev) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

function TrendBadge({ current, prev, label }: { current: number; prev: number; label: string }) {
  const t = calcTrend(current, prev);
  if (!t) return <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</p>;
  return (
    <p className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${t.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
      {t.up
        ? <TrendingUp className="w-3 h-3" />
        : <TrendingDown className="w-3 h-3" />}
      {t.up ? "+" : "-"}{t.pct}% vs prev period
    </p>
  );
}

export default function AnalyticsPage() {
  const [range,     setRange]     = useState<Range>("365d");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const invoices    = useQuery(api.invoices.getAnalyticsData, { range });
  const allInvoices = useQuery(api.invoices.getAnalyticsData, { range: "all" });
  const settings    = useQuery(api.settings.getSettings);
  const currency    = settings?.defaultCurrency ?? "GBP";

  const isPro = currentUser?.plan === "pro";

  // Previous period data for trend indicators
  const msPerDay  = 24 * 60 * 60 * 1000;
  const now       = Date.now();
  const rangeDays = range === "30d" ? 30 : range === "90d" ? 90 : range === "365d" ? 365 : null;
  const rangeMs   = rangeDays ? rangeDays * msPerDay : null;

  const prevInvoices = (rangeMs && allInvoices)
    ? allInvoices.filter(i => i.createdAt >= now - 2 * rangeMs && i.createdAt < now - rangeMs)
    : [];

  const prevBilled    = prevInvoices.reduce((s, i) => s + i.total, 0);
  const prevCollected = prevInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const prevCount     = prevInvoices.length;
  const prevCollPct   = prevBilled > 0 ? Math.round((prevCollected / prevBilled) * 100) : 0;

  const monthlyData = (() => {
    if (!invoices) return [];
    const map: Record<string, { month: string; Billed: number; Collected: number }> = {};
    invoices.forEach((inv) => {
      const d   = new Date(inv.createdAt);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { month: key, Billed: 0, Collected: 0 };
      map[key].Billed += inv.total;
      if (inv.status === "paid") map[key].Collected += inv.total;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  })();

  const statusData = (() => {
    if (!invoices) return [];
    const counts: Record<string, number> = {};
    invoices.filter((inv) => inv.status !== "voided").forEach((inv) => {
      counts[inv.status] = (counts[inv.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({
      name:  status.charAt(0).toUpperCase() + status.slice(1),
      value,
      color: STATUS_COLORS[status] ?? "#D1D5DB",
    }));
  })();

  const topClients = (() => {
    if (!invoices) return [];
    const map: Record<string, { name: string; total: number }> = {};
    invoices.forEach((inv) => {
      const name = inv.clientSnapshot.fullName;
      if (!map[name]) map[name] = { name, total: 0 };
      map[name].total += inv.total;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  })();
  const maxRevenue = topClients[0]?.total ?? 1;

  const totalBilled    = invoices?.reduce((s, i) => s + i.total, 0) ?? 0;
  const totalCollected = invoices?.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0) ?? 0;
  const invoiceCount   = invoices?.length ?? 0;
  const collectionPct  = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const fmtTip       = (v: number) => formatCurrency(v, currency);
  const tooltipStyle = { border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", backgroundColor: "#ffffff", color: "#111827" };
  const itemStyle   = { color: "#374151" };
  const labelStyle  = { color: "#111827", fontWeight: 600 };
  const axisProps    = { tick: { fontSize: 11, fill: "#9CA3AF" }, tickLine: false as const };
  const rangeLabel   = range === "all" ? "All time" : `Last ${range}`;
  const showTrend    = range !== "all";

  const statCards = [
    {
      label:   "Total Billed",
      value:   invoices ? formatCurrency(totalBilled,    currency) : null,
      current: totalBilled,
      prev:    prevBilled,
      sub:     rangeLabel,
    },
    {
      label:   "Total Collected",
      value:   invoices ? formatCurrency(totalCollected, currency) : null,
      current: totalCollected,
      prev:    prevCollected,
      sub:     rangeLabel,
    },
    {
      label:   "Invoices",
      value:   invoices ? String(invoiceCount) : null,
      current: invoiceCount,
      prev:    prevCount,
      sub:     rangeLabel,
    },
    {
      label:   "Collection Rate",
      value:   invoices ? `${collectionPct}%` : null,
      current: collectionPct,
      prev:    prevCollPct,
      sub:     rangeLabel,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenue breakdown and business overview</p>
        </div>
        <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm self-start">
          {(["30d", "90d", "365d", "all"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                range === r
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5 font-medium">
          Showing: <span className="font-bold text-gray-700 dark:text-gray-300">{rangeLabel}</span>
          {showTrend && <span className="ml-1 text-gray-400">· compared to previous {range}</span>}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">{s.label}</p>
              {s.value === null ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">{s.value}</p>
                  {showTrend
                    ? <TrendBadge current={s.current} prev={s.prev} label={s.sub} />
                    : <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.sub}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Revenue chart + status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-100">Revenue Over Time</CardTitle>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              {([
                { type: "bar",  icon: <BarChart2  className="w-3.5 h-3.5" />, title: "Bar"  },
                { type: "line", icon: <TrendingUp className="w-3.5 h-3.5" />, title: "Line" },
              ] as { type: ChartType; icon: React.ReactNode; title: string }[]).map(({ type, icon, title }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  title={title}
                  className={`p-1.5 rounded-md transition-all ${
                    chartType === type
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-gray-200"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {!invoices ? (
              <Skeleton className="h-56 w-full" />
            ) : monthlyData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data for this period</div>
            ) : (
              <ResponsiveContainer key={chartType} width="100%" height={220}>
                {chartType === "bar" ? (
                  <BarChart data={monthlyData} margin={{ left: 0, right: 4 }}>
                    <XAxis dataKey="month" {...axisProps} axisLine={false} />
                    <YAxis {...axisProps} axisLine={false} tickFormatter={fmtTip} width={70} />
                    <Tooltip formatter={fmtTip} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
                    <Bar dataKey="Billed"    fill="#3B82F6" radius={[4,4,0,0]} />
                    <Bar dataKey="Collected" fill="#22C55E" radius={[4,4,0,0]} />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyData} margin={{ left: 0, right: 4 }}>
                    <XAxis dataKey="month" {...axisProps} axisLine={false} />
                    <YAxis {...axisProps} axisLine={false} tickFormatter={fmtTip} width={70} />
                    <Tooltip formatter={fmtTip} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
                    <Line type="monotone" dataKey="Billed"    stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Collected" stroke="#22C55E" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
            <div className="flex items-center gap-4 mt-2 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><span className="w-3 h-1.5 rounded-full bg-blue-500 inline-block" />Billed</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" />Collected</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-100">Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            {!invoices ? <Skeleton className="h-48 w-full" /> : statusData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={75} dataKey="value" paddingAngle={2}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card className="rounded-2xl shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-100">Top Clients by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {!invoices ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : topClients.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-4">
              {topClients.map((client, i) => {
                const pct = Math.round((client.total / maxRevenue) * 100);
                return (
                  <div key={client.name} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-4 shrink-0">#{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-36 shrink-0 truncate">{client.name}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100 w-28 text-right shrink-0">
                      {formatCurrency(client.total, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Predictive Insights (Pro) ── */}
      {currentUser === undefined ? null : isPro ? (
        <PredictiveInsights allInvoices={allInvoices ?? []} currency={currency} />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-6 flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
            <Sparkles className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Predictive Insights</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Revenue forecasts, slow-payer alerts, and trend projections — available on Pro.</p>
          </div>
          <UpgradeButton />
        </div>
      )}
    </div>
  );
}

// ── Predictive Insights component (Pro-only) ────────────────────────────────

type Invoice = { status: string; total: number; createdAt: number; dueDate?: string; clientSnapshot: { fullName: string } };

function PredictiveInsights({ allInvoices, currency }: { allInvoices: Invoice[]; currency: string }) {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Revenue forecast: avg monthly revenue over last 3 months
  const last90 = allInvoices.filter(i => i.createdAt >= now - 90 * msPerDay && i.status === "paid");
  const avgMonthly = last90.reduce((s, i) => s + i.total, 0) / 3;

  // Slow payers: sent invoices that have been outstanding > 30 days
  const slowPayers = allInvoices
    .filter(i => i.status === "sent" && i.createdAt < now - 30 * msPerDay)
    .map(i => i.clientSnapshot.fullName)
    .filter((n, idx, arr) => arr.indexOf(n) === idx)
    .slice(0, 5);

  // Best month
  const monthMap: Record<string, number> = {};
  allInvoices.filter(i => i.status === "paid").forEach(i => {
    const key = new Date(i.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    monthMap[key] = (monthMap[key] ?? 0) + i.total;
  });
  const bestMonth = Object.entries(monthMap).sort(([,a],[,b]) => b - a)[0];

  // Collection rate trend: compare last 30d vs 30-60d
  const last30 = allInvoices.filter(i => i.createdAt >= now - 30 * msPerDay);
  const prev30 = allInvoices.filter(i => i.createdAt >= now - 60 * msPerDay && i.createdAt < now - 30 * msPerDay);
  const rate30 = last30.length > 0 ? Math.round(last30.filter(i => i.status === "paid").length / last30.length * 100) : 0;
  const ratePrev = prev30.length > 0 ? Math.round(prev30.filter(i => i.status === "paid").length / prev30.length * 100) : 0;
  const rateDelta = rate30 - ratePrev;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Predictive Insights</h2>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800">Pro</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Forecast */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">30-Day Forecast</p>
          </div>
          <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(avgMonthly, currency)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Based on avg of last 3 months collected</p>
          {rateDelta !== 0 && (
            <p className={`text-xs font-semibold mt-2 flex items-center gap-0.5 ${rateDelta > 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {rateDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Collection rate {rateDelta > 0 ? "+" : ""}{rateDelta}% vs prev 30d
            </p>
          )}
        </div>

        {/* Best month */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Peak Revenue Month</p>
          </div>
          {bestMonth ? (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bestMonth[0]}</p>
              <p className="text-sm tabular-nums text-gray-500 dark:text-gray-400 mt-1">{formatCurrency(bestMonth[1], currency)} collected</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Not enough data yet</p>
          )}
        </div>

        {/* Slow payers */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Slow Payers</p>
          </div>
          {slowPayers.length === 0 ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">All invoices are on track</p>
          ) : (
            <ul className="space-y-1">
              {slowPayers.map(name => (
                <li key={name} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />{name}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Sent invoices outstanding &gt; 30 days</p>
        </div>
      </div>
    </div>
  );
}
