"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FilePlus, FileText, Download, Search, X, CheckSquare, Square, CheckCheck, AlertTriangle, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center ring-1 ring-blue-200 dark:ring-blue-800 mt-0.5 shrink-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Invoices</h1>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">
              {invoices ? `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}` : "Manage and track all your invoices"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoices && invoices.length > 0 && (
            <Button variant="outline" size="sm" className="h-10 gap-2 shadow-sm" onClick={() => exportCSV(invoices)}>
              <Download className="w-4 h-4" />Export CSV
            </Button>
          )}
          <Button asChild className="h-10 gap-2 shadow-md">
            <Link href="/invoices/new"><FilePlus className="w-4 h-4" />New Invoice</Link>
          </Button>
        </div>
      </div>

      {clientIdFilter && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300 w-fit animate-slide-up">
          <span>Showing invoices{clientName ? ` for ${clientName}` : " for selected client"}</span>
          <Link href="/invoices" className="ml-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-blue-200/50 dark:border-blue-900/30 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-6 py-4 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-950/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search invoices…"
              className="pl-9 h-10 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-primary-500 shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
            {STATUS_FILTERS.map((f) => (
              <button
                key={String(f.value)}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  statusFilter === f.value
                    ? "bg-primary-500 text-white shadow-sm scale-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 scale-95"
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
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 px-6 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-200/50 dark:ring-blue-700/30">
              <FileText className="w-9 h-9 text-blue-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
              {search ? `No results for "${search}"` : statusFilter ? `No ${statusFilter} invoices` : "No invoices yet"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              {search ? "Try adjusting your search terms or filters." : "Create your first invoice to start getting paid. It only takes a minute."}
            </p>
            {!search && !statusFilter && (
              <Button asChild className="h-11 px-6 shadow-md shadow-primary-500/20"><Link href="/invoices/new">Create your first invoice</Link></Button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800/50">
              {visible.map((inv) => (
                <div
                  key={inv._id}
                  className={`px-5 py-4 flex flex-col gap-3 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/40 active:bg-gray-100 dark:active:bg-gray-800 transition-colors group relative ${
                    selected.has(inv._id) ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          const next = new Set(selected);
                          if (next.has(inv._id)) next.delete(inv._id);
                          else next.add(inv._id);
                          setSelected(next);
                        }}
                        className="p-1 -ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {selected.has(inv._id)
                          ? <CheckSquare className="w-5 h-5 text-blue-600" />
                          : <Square className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</p>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[inv.status] ?? "bg-gray-300"}`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <InvoiceStatusBadge status={inv.status} />
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => {
                              bulkMarkPaid({ invoiceIds: [inv._id as Id<"invoices">], status: "paid" });
                              toast.success("Marked as paid");
                            }}>
                              <CheckCheck className="w-4 h-4 text-emerald-500 mr-2" /> Mark Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              bulkMarkOverdue({ invoiceIds: [inv._id as Id<"invoices">], status: "overdue" });
                              toast.success("Marked as overdue");
                            }}>
                              <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" /> Mark Overdue
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => {
                              bulkDelete({ invoiceIds: [inv._id as Id<"invoices">] });
                              toast.success("Invoice deleted");
                            }}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {inv.clientSnapshot.fullName}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Due: {formatDate(inv.dueDate)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden sm:table w-full text-left">
              <thead>
                <tr className="border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-900/20">
                  <th className="px-6 py-4 w-12 font-medium">
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
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">Invoice #</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 hidden md:table-cell">Issued</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 hidden md:table-cell">Due</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36 text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {visible.map((inv) => (
                  <tr
                    key={inv._id}
                    className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group relative ${
                      selected.has(inv._id) ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() => (window.location.href = `/invoices/${inv._id}`)}
                  >
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
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
                    <td className="px-6 py-5 text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400 shrink-0 border border-gray-200/50 dark:border-gray-700 group-hover:scale-105 transition-transform">
                          {inv.clientSnapshot.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{inv.clientSnapshot.fullName}</p>
                          {inv.clientSnapshot.companyName && (
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{inv.clientSnapshot.companyName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(inv.issueDate)}</td>
                    <td className={`px-6 py-5 text-sm font-medium hidden md:table-cell ${inv.status === "overdue" ? "text-rose-600 dark:text-rose-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-base font-extrabold tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(inv.total, inv.currency)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <InvoiceStatusBadge status={inv.status} />
                        <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => {
                                bulkMarkPaid({ invoiceIds: [inv._id as Id<"invoices">], status: "paid" });
                                toast.success("Marked as paid");
                              }}>
                                <CheckCheck className="w-4 h-4 text-emerald-500 mr-2" /> Mark Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                bulkMarkOverdue({ invoiceIds: [inv._id as Id<"invoices">], status: "overdue" });
                                toast.success("Marked as overdue");
                              }}>
                                <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" /> Mark Overdue
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => {
                                bulkDelete({ invoiceIds: [inv._id as Id<"invoices">] });
                                toast.success("Invoice deleted");
                              }}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasMore && (
              <div className="flex justify-center py-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-6 py-2.5 text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl border border-primary-100 dark:border-primary-800 transition-all"
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
