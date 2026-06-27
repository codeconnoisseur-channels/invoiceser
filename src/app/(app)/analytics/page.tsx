"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { BarChart2, TrendingUp, TrendingDown, Sparkles, PieChart as PieChartIcon, AlertTriangle, CalendarCheck, AreaChart as AreaChartIcon } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade-modal";

type Range     = "30d" | "90d" | "365d" | "all";
type ChartType = "bar" | "area";

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
  const [range,     setRange]     = useState<Range>("30d");
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
      color:   { label: "text-blue-500 dark:text-blue-400", bg: "from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-transparent" },
    },
    {
      label:   "Total Collected",
      value:   invoices ? formatCurrency(totalCollected, currency) : null,
      current: totalCollected,
      prev:    prevCollected,
      sub:     rangeLabel,
      color:   { label: "text-emerald-500 dark:text-emerald-400", bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-transparent" },
    },
    {
      label:   "Invoices",
      value:   invoices ? String(invoiceCount) : null,
      current: invoiceCount,
      prev:    prevCount,
      sub:     rangeLabel,
      color:   { label: "text-violet-500 dark:text-violet-400", bg: "from-violet-50 to-violet-100/50 dark:from-violet-900/10 dark:to-transparent" },
    },
    {
      label:   "Collection Rate",
      value:   invoices ? `${collectionPct}%` : null,
      current: collectionPct,
      prev:    prevCollPct,
      sub:     rangeLabel,
      color:   { label: "text-amber-500 dark:text-amber-400", bg: "from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-transparent" },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center ring-1 ring-emerald-200 dark:ring-emerald-800 mt-0.5 shrink-0">
            <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Analytics</h1>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">Revenue breakdown and business overview</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm self-start">
          {(["30d", "90d", "365d", "all"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === r
                  ? "bg-primary-500 text-white shadow-sm scale-100"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 scale-95"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
          Showing: <span className="text-gray-700 dark:text-gray-300">{rangeLabel}</span>
          {showTrend && <span className="ml-1 text-gray-400 font-medium normal-case">· compared to previous {range}</span>}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((s, i) => {
            const bgColors = ["bg-blue-50/60 dark:bg-blue-950/30", "bg-emerald-50/60 dark:bg-emerald-950/30", "bg-violet-50/60 dark:bg-violet-950/30", "bg-amber-50/60 dark:bg-amber-950/30"];
            const borderColors = ["border-l-blue-500", "border-l-emerald-500", "border-l-violet-500", "border-l-amber-500"];
            const iconBgs = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];
            const icons = [
              <BarChart2 key="b" className="w-4.5 h-4.5 text-white" />,
              <TrendingUp key="t" className="w-4.5 h-4.5 text-white" />,
              <CalendarCheck key="c" className="w-4.5 h-4.5 text-white" />,
              <PieChartIcon key="s" className="w-4.5 h-4.5 text-white" />,
            ];
            return (
              <div key={s.label} className={`group rounded-2xl ${bgColors[i]} border border-gray-200/50 dark:border-gray-800 border-l-4 ${borderColors[i]} shadow-card dark:shadow-card-dark p-6 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-xs font-bold ${s.color.label} uppercase tracking-widest relative z-10`}>{s.label}</p>
                  <div className={`w-10 h-10 rounded-xl ${iconBgs[i]} flex items-center justify-center shadow-md`}>
                    {icons[i]}
                  </div>
                </div>
                {s.value === null ? (
                  <div className="relative z-10">
                    <Skeleton className="h-9 w-28 mb-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <div className="relative z-10">
                    <p className="text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">{s.value}</p>
                    {showTrend
                      ? <TrendBadge current={s.current} prev={s.prev} label={s.sub} />
                      : <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{s.sub}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue chart + status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl shadow-card dark:shadow-card-dark border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="pb-4 pt-5 px-6 flex flex-row items-center justify-between border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-950/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
                <BarChart2 className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-sm font-bold text-blue-800 dark:text-blue-200">Revenue Over Time</CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 shadow-sm">
              {([
                { type: "bar",  icon: <BarChart2  className="w-3.5 h-3.5" />, title: "Bar"  },
                { type: "area", icon: <AreaChartIcon className="w-3.5 h-3.5" />, title: "Area" },
              ] as { type: ChartType; icon: React.ReactNode; title: string }[]).map(({ type, icon, title }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  title={title}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    chartType === type
                      ? "bg-gray-100 dark:bg-gray-800 shadow-inner text-gray-900 dark:text-gray-100"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!invoices ? (
              <Skeleton className="h-[280px] w-full rounded-xl" />
            ) : monthlyData.length === 0 ? (
              <div className="h-[280px] flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <BarChart2 className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <p>No revenue data for this period</p>
              </div>
            ) : (
              <ResponsiveContainer key={chartType} width="100%" height={280}>
                {chartType === "bar" ? (
                  <BarChart data={monthlyData} margin={{ left: 0, right: 4 }}>
                    <XAxis dataKey="month" {...axisProps} axisLine={false} />
                    <YAxis {...axisProps} axisLine={false} tickFormatter={fmtTip} width={70} />
                    <Tooltip formatter={fmtTip} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="Billed"    fill="#3B82F6" radius={[4,4,0,0]} />
                    <Bar dataKey="Collected" fill="#10B981" radius={[4,4,0,0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={monthlyData} margin={{ left: 0, right: 4 }}>
                    <defs>
                      <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" {...axisProps} axisLine={false} />
                    <YAxis {...axisProps} axisLine={false} tickFormatter={fmtTip} width={70} />
                    <Tooltip formatter={fmtTip} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
                    <Area type="monotone" dataKey="Billed"    stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBilled)" />
                    <Area type="monotone" dataKey="Collected" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCollected)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
            <div className="flex items-center gap-6 mt-6 justify-center">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400"><span className="w-3 h-3 rounded bg-blue-500 inline-block shadow-sm" />Billed</span>
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400"><span className="w-3 h-3 rounded bg-emerald-500 inline-block shadow-sm" />Collected</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card dark:shadow-card-dark border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="pb-4 pt-5 px-6 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/70 dark:bg-emerald-950/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
                <PieChartIcon className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Invoice Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!invoices ? <Skeleton className="h-[280px] w-full rounded-xl" /> : statusData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity" />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12, fontWeight: 500, color: "#6B7280", marginTop: 20 }} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card className="rounded-2xl shadow-card dark:shadow-card-dark border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="pb-4 pt-5 px-6 border-b border-violet-100 dark:border-violet-900/30 bg-violet-50/70 dark:bg-violet-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-sm font-bold text-violet-800 dark:text-violet-200">Top Clients by Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!invoices ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}</div>
          ) : topClients.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-5">
              {topClients.map((client, i) => {
                const pct = Math.round((client.total / maxRevenue) * 100);
                return (
                  <div key={client.name} className="flex items-center gap-4 group">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md py-1 text-center">#{i + 1}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 w-40 shrink-0 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{client.name}</span>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out-expo" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-extrabold tabular-nums text-gray-900 dark:text-gray-100 w-32 text-right shrink-0">
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
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Unlock Predictive Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">Get AI-powered revenue forecasts, automated slow-payer alerts, and intelligent trend projections by upgrading to Pro.</p>
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
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Predictive Insights</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800 ml-2 shadow-sm">Pro</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Forecast */}
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900 shadow-card dark:shadow-card-dark p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">30-Day Forecast</p>
          </div>
          <p className="text-3xl font-extrabold tabular-nums text-gray-900 dark:text-gray-100 tracking-tight">{formatCurrency(avgMonthly, currency)}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Based on avg of last 3 months collected</p>
          {rateDelta !== 0 && (
            <div className={`mt-4 pt-4 border-t border-blue-100/50 dark:border-blue-800/30`}>
              <p className={`text-xs font-bold flex items-center gap-1.5 ${rateDelta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {rateDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                Collection rate {rateDelta > 0 ? "+" : ""}{rateDelta}% vs prev 30d
              </p>
            </div>
          )}
        </div>

        {/* Best month */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Peak Revenue</p>
          </div>
          {bestMonth ? (
            <>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">{bestMonth[0]}</p>
              <p className="text-sm font-medium tabular-nums text-gray-500 dark:text-gray-400 mt-2">{formatCurrency(bestMonth[1], currency)} collected</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">Not enough data yet</p>
          )}
        </div>

        {/* Slow payers */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Slow Payers</p>
          </div>
          {slowPayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">All on track</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {slowPayers.map(name => (
                <li key={name} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shrink-0" />
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
