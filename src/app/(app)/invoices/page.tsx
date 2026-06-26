"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FilePlus, FileText, Download, Search, X, CheckSquare, Square, CheckCheck, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceStatusBadge } from "@/components/invoices/status-badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { label: "All",     value: undefined   },
  { label: "Draft",   value: "draft"     },
  { label: "Sent",    value: "sent"      },
  { label: "Overdue", value: "overdue"   },
  { label: "Paid",    value: "paid"      },
] as const;

function exportCSV(invoices: Array<{ invoiceNumber: string; clientSnapshot: { fullName: string; companyName?: string }; currency: string; total: number; status: string; issueDate: string; dueDate?: string }>) {
  const rows = [
    ["Invoice #", "Client", "Company", "Currency", "Total", "Status", "Issued", "Due"],
    ...invoices.map((inv) => [
      inv.invoiceNumber,
      inv.clientSnapshot.fullName,
      inv.clientSnapshot.companyName ?? "",
      inv.currency,
      inv.total.toFixed(2),
      inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
      inv.issueDate,
      inv.dueDate ?? "",
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoiceser-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_DOT: Record<string, string> = {
  draft:   "bg-gray-300 dark:bg-gray-600",
  sent:    "bg-blue-500",
  paid:    "bg-emerald-500",
  overdue: "bg-rose-500",
};

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesContent />
    </Suspense>
  );
}

function InvoicesContent() {
  const searchParams   = useSearchParams();
  const clientIdFilter = searchParams.get("clientId");

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<"draft" | "sent" | "paid" | "overdue" | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(25);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkPending, setBulkPending] = useState<string | null>(null);
  const PAGE_SIZE = 25;

  const bulkMarkPaid = useMutation(api.invoices.bulkUpdateStatus);
  const bulkMarkOverdue = useMutation(api.invoices.bulkUpdateStatus);
  const bulkDelete = useMutation(api.invoices.bulkDeleteInvoices);

  const invoices = useQuery(api.invoices.listInvoices, { status: statusFilter });

  const filtered = invoices?.filter((inv) => {
    if (clientIdFilter && (inv.clientId as string | undefined) !== clientIdFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientSnapshot.fullName.toLowerCase().includes(q) ||
      (inv.clientSnapshot.companyName ?? "").toLowerCase().includes(q)
    );
  });

  const clientName = clientIdFilter
    ? (filtered?.[0]?.clientSnapshot.fullName ?? filtered?.[0]?.clientSnapshot.companyName)
    : null;

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, statusFilter, clientIdFilter]);

  const visible = filtered?.slice(0, visibleCount) ?? [];
  const hasMore = filtered ? visibleCount < filtered.length : false;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {invoices ? `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}` : "Manage and track all your invoices"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {invoices && invoices.length > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => exportCSV(invoices)}>
              <Download className="w-3.5 h-3.5" />Export CSV
            </Button>
          )}
          <Button asChild className="gap-2">
            <Link href="/invoices/new"><FilePlus className="w-4 h-4" />New Invoice</Link>
          </Button>
        </div>
      </div>

      {clientIdFilter && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 w-fit">
          <span>Showing invoices{clientName ? ` for ${clientName}` : " for selected client"}</span>
          <Link href="/invoices" className="ml-1 hover:text-blue-900 dark:hover:text-blue-100">
            <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search invoices…"
              className="pl-9 h-8 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={String(f.value)}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === f.value
                    ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-blue-50/60 dark:bg-blue-900/15">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 mr-2 shrink-0">{selected.size} selected</span>
            <button
              disabled={bulkPending !== null}
              onClick={async () => {
                setBulkPending("paid");
                try {
                  await bulkMarkPaid({ invoiceIds: Array.from(selected) as Id<"invoices">[], status: "paid" });
                  toast.success(`Marked ${selected.size} invoice${selected.size > 1 ? "s" : ""} as paid`);
                  setSelected(new Set());
                } catch { toast.error("Failed to mark invoices as paid"); }
                finally { setBulkPending(null); }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> {bulkPending === "paid" ? "Marking..." : "Mark Paid"}
            </button>
            <button
              disabled={bulkPending !== null}
              onClick={async () => {
                setBulkPending("overdue");
                try {
                  await bulkMarkOverdue({ invoiceIds: Array.from(selected) as Id<"invoices">[], status: "overdue" });
                  toast.success(`Marked ${selected.size} invoice${selected.size > 1 ? "s" : ""} as overdue`);
                  setSelected(new Set());
                } catch { toast.error("Failed to mark invoices as overdue"); }
                finally { setBulkPending(null); }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> {bulkPending === "overdue" ? "Marking..." : "Mark Overdue"}
            </button>
            <button
              disabled={bulkPending !== null}
              onClick={async () => {
                setBulkPending("delete");
                try {
                  await bulkDelete({ invoiceIds: Array.from(selected) as Id<"invoices">[] });
                  toast.success(`Deleted ${selected.size} invoice${selected.size > 1 ? "s" : ""}`);
                  setSelected(new Set());
                } catch { toast.error("Failed to delete invoices"); }
                finally { setBulkPending(null); }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> {bulkPending === "delete" ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                const selectedInvs = invoices?.filter((i) => selected.has(i._id)) ?? [];
                exportCSV(selectedInvs);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-auto"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {filtered === undefined ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
              <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              {search ? `No results for "${search}"` : statusFilter ? `No ${statusFilter} invoices` : "No invoices yet"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
              {search ? "Try a different search term" : "Create your first invoice to get started"}
            </p>
            {!search && !statusFilter && (
              <Button asChild><Link href="/invoices/new">Create your first invoice</Link></Button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {visible.map((inv) => (
                <div
                  key={inv._id}
                  className={`px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 active:bg-gray-100 transition-colors ${
                    selected.has(inv._id) ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                >
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        const next = new Set(selected);
                        if (next.has(inv._id)) next.delete(inv._id);
                        else next.add(inv._id);
                        setSelected(next);
                      }}
                      className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {selected.has(inv._id)
                        ? <CheckSquare className="w-4 h-4 text-blue-600" />
                        : <Square className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
                    {inv.clientSnapshot.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 truncate">{inv.invoiceNumber}</p>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[inv.status] ?? "bg-gray-300"}`} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{inv.clientSnapshot.fullName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(inv.issueDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</p>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 w-10">
                    <button onClick={() => {
                      if (selected.size === visible.length) setSelected(new Set());
                      else setSelected(new Set(visible.map((i) => i._id)));
                    }} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      {selected.size === visible.length && visible.length > 0
                        ? <CheckSquare className="w-4 h-4 text-blue-600" />
                        : <Square className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-36">Invoice #</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-28 hidden md:table-cell">Issued</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-28 hidden md:table-cell">Due</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-36">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((inv) => (
                  <tr
                    key={inv._id}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 cursor-pointer transition-colors ${
                      selected.has(inv._id) ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          const next = new Set(selected);
                          if (next.has(inv._id)) next.delete(inv._id);
                          else next.add(inv._id);
                          setSelected(next);
                        }}
                        className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {selected.has(inv._id)
                          ? <CheckSquare className="w-4 h-4 text-blue-600" />
                          : <Square className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
                          {inv.clientSnapshot.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{inv.clientSnapshot.fullName}</p>
                          {inv.clientSnapshot.companyName && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{inv.clientSnapshot.companyName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{formatDate(inv.issueDate)}</td>
                    <td className={`px-5 py-4 text-sm font-medium hidden md:table-cell ${inv.status === "overdue" ? "text-rose-600 dark:text-rose-400" : "text-gray-600 dark:text-gray-400"}`}>
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[inv.status] ?? "bg-gray-300"}`} />
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasMore && (
              <div className="flex justify-center py-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-5 py-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-lg border border-violet-200 dark:border-violet-800 transition-colors"
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
