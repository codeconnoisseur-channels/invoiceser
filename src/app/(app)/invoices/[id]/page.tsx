"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Send, Download, Ban, CreditCard, Copy, RefreshCw,
  AlertTriangle, Pencil, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/invoices/status-badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate, timeAgo } from "@/lib/dates";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvoicePreview } from "@/components/invoices/invoice-preview";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as Id<"invoices">;

  const invoice  = useQuery(api.invoices.getInvoice, { invoiceId });
  const payments = useQuery(api.payments.getPaymentsForInvoice, { invoiceId });
  const activity = useQuery(api.activityLog.getActivityForInvoice, { invoiceId });
  const settings = useQuery(api.settings.getSettings);
  const logoUrl  = useQuery(api.settings.getLogoUrl, settings?.logoStorageId ? { storageId: settings.logoStorageId } : "skip");

  const voidInvoice    = useMutation(api.invoices.voidInvoice);
  const reissueInvoice = useMutation(api.invoices.reissueInvoice);
  const markSent       = useMutation(api.invoices.markInvoiceSent);
  const recordPayment  = useMutation(api.payments.recordPayment);

  const [voidDialog,          setVoidDialog]          = useState(false);
  const [voidReason,          setVoidReason]          = useState("");
  const [paymentDialog,       setPaymentDialog]       = useState(false);
  const [confirmSendDialog,   setConfirmSendDialog]   = useState(false);
  const [paymentAmount,       setPaymentAmount]       = useState("");
  const [paymentDate,         setPaymentDate]         = useState(new Date().toISOString().split("T")[0]);
  const [paymentNote,         setPaymentNote]         = useState("");
  const [loading,             setLoading]             = useState(false);

  if (!invoice) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const totalPaid  = payments?.reduce((s, p) => s + p.amount, 0) ?? 0;
  const outstanding = invoice.total - totalPaid;
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const publicUrl  = `${appUrl}/invoice/${invoice.publicToken}`;

  async function handleSend() {
    try {
      setLoading(true);
      if (invoice!.status === "draft") await markSent({ invoiceId });
      const res = await fetch("/api/email/send-invoice", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Failed to send invoice");
      }
      toast.success("Invoice sent!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to send invoice"); }
    finally { setLoading(false); }
  }

  async function handleSendReminder() {
    try {
      setLoading(true);
      await fetch("/api/email/send-reminder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      toast.success("Reminder sent!");
    } catch { toast.error("Failed to send reminder"); }
    finally { setLoading(false); }
  }

  async function handleVoid() {
    if (!voidReason.trim()) { toast.error("Please enter a void reason"); return; }
    try {
      setLoading(true);
      await voidInvoice({ invoiceId, voidReason });
      setVoidDialog(false);
      toast.success("Invoice voided");
    } catch { toast.error("Failed to void invoice"); }
    finally { setLoading(false); }
  }

  async function handleReissue() {
    try {
      setLoading(true);
      const result = await reissueInvoice({ invoiceId });
      toast.success(`Reissued as ${result.invoiceNumber}`);
      window.location.href = `/invoices/${result.invoiceId}`;
    } catch { toast.error("Failed to reissue"); }
    finally { setLoading(false); }
  }

  async function handleRecordPayment() {
    try {
      setLoading(true);
      await recordPayment({
        invoiceId, amount: Number(paymentAmount),
        dateReceived: paymentDate, note: paymentNote || undefined,
      });
      setPaymentDialog(false);
      setPaymentAmount("");
      setPaymentNote("");
      toast.success("Payment recorded");
    } catch { toast.error("Failed to record payment"); }
    finally { setLoading(false); }
  }

  const activityLabels: Record<string, string> = {
    created: "Invoice created",
    sent: "Invoice sent",
    viewed: "Viewed by client",
    payment_recorded: "Payment recorded",
    paid: "Invoice paid",
    overdue: "Marked as overdue",
    voided: "Invoice cancelled",
    reissued: "Reissued",
    reminder_sent: "Reminder sent",
    email_failed: "Email delivery failed",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/invoices" className="hover:text-gray-600">Invoices</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">{invoice.invoiceNumber}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 font-mono">{invoice.invoiceNumber}</h1>
          <InvoiceStatusBadge status={invoice.status} />
          {invoice.reissuedFromId && (
            <span className="text-xs text-gray-400">Reissued from previous invoice</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {invoice.emailDeliveryStatus === "failed" && (
            <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5" />Email delivery failed
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success("Link copied"); }}>
            <Copy className="w-4 h-4" />Copy link
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`/api/pdf/${invoiceId}?store=false`, "_blank")}>
            <Download className="w-4 h-4" />Download PDF
          </Button>
          {invoice.status === "draft" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/invoices/${invoiceId}/edit`}><Pencil className="w-4 h-4" />Edit</Link>
            </Button>
          )}
          {(invoice.status === "draft" || invoice.status === "sent" || invoice.status === "overdue") && (
            <Button size="sm" onClick={() => setConfirmSendDialog(true)} disabled={loading}>
              <Send className="w-4 h-4" />{invoice.status === "draft" ? "Send Invoice" : "Resend"}
            </Button>
          )}
          {invoice.status === "voided" && (
            <Button size="sm" onClick={handleReissue} disabled={loading}>
              <RefreshCw className="w-4 h-4" />Reissue
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — invoice preview */}
        <div className="lg:col-span-3">
          <InvoicePreview
            companyName={settings?.companyName ?? ""}
            logoUrl={logoUrl}
            brandColor={settings?.brandColor ?? "#2563EB"}
            hideBranding={settings?.hideBranding}
            invoiceFont={(settings as { invoiceFont?: string } | null)?.invoiceFont}
            businessAddress={settings?.businessAddress ?? ""}
            businessCity={settings?.businessCity ?? ""}
            businessCountry={settings?.businessCountry ?? ""}
            businessPhone={settings?.businessPhone ?? ""}
            businessEmail={settings?.businessEmail ?? ""}
            businessWebsite={settings?.businessWebsite ?? ""}
            showBusinessAddress={settings?.showBusinessAddress}
            showBusinessPhone={settings?.showBusinessPhone}
            showBusinessEmail={settings?.showBusinessEmail}
            showBusinessWebsite={settings?.showBusinessWebsite}
            invoiceNumber={invoice.invoiceNumber}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
            clientName={invoice.clientSnapshot.fullName}
            clientCompany={invoice.clientSnapshot.companyName}
            clientAddress={(invoice.clientSnapshot as { address?: string }).address}
            clientEmail={invoice.clientSnapshot.email}
            lineItems={invoice.lineItems}
            currency={invoice.currency}
            subtotal={invoice.subtotal}
            hasTax={invoice.salesTaxEnabled || invoice.vatEnabled}
            salesTaxEnabled={invoice.salesTaxEnabled}
            salesTaxAmount={invoice.salesTaxAmount ?? 0}
            salesTaxLabel={invoice.salesTaxLabel}
            salesTaxRate={invoice.salesTaxRate}
            vatEnabled={invoice.vatEnabled}
            vatAmount={invoice.vatAmount ?? 0}
            vatLabel={invoice.vatLabel}
            vatRate={invoice.vatRate}
            total={invoice.total}
            paymentInstructions={invoice.paymentInstructions}
            notes={invoice.notes}
          />
        </div>

        {/* Right column — actions & info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Actions */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Actions</p>
            <div className="space-y-2">
              {["sent", "overdue", "paid"].includes(invoice.status) && (
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setPaymentDialog(true)}>
                  <CreditCard className="w-4 h-4" />Record Payment
                </Button>
              )}
              {["sent", "overdue"].includes(invoice.status) && (
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSendReminder} disabled={loading}>
                  <Send className="w-4 h-4" />Send Reminder
                </Button>
              )}
              {["sent", "overdue"].includes(invoice.status) && (
                <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-gray-700" onClick={() => setVoidDialog(true)}>
                  <Ban className="w-4 h-4" />Cancel Invoice
                </Button>
              )}
            </div>
          </div>

          {/* Payment progress */}
          {payments && payments.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Payment History</p>
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(p.amount, invoice.currency)}</p>
                      <p className="text-xs text-gray-400">{formatDate(p.dateReceived)}{p.note ? ` · ${p.note}` : ""}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Outstanding</span>
                    <span className={`font-mono font-medium ${outstanding <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                      {formatCurrency(Math.max(outstanding, 0), invoice.currency)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, (totalPaid / invoice.total) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice details */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">Issued</span>
                <span className="text-gray-700 dark:text-gray-300">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">Due</span>
                <span className={invoice.status === "overdue" ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-700 dark:text-gray-300"}>
                  {invoice.dueDate ? formatDate(invoice.dueDate) : <span className="text-gray-400 italic">—</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">Currency</span>
                <span className="text-gray-700 dark:text-gray-300">{invoice.currency}</span>
              </div>
              {invoice.voidReason && (
                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-0.5">Void reason</p>
                  <p className="text-red-600 dark:text-red-400">{invoice.voidReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Activity</p>
            {!activity ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="space-y-3">
                {activity.map((event) => (
                  <div key={event._id} className="flex gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">{activityLabels[event.eventType] ?? event.eventType}</p>
                      <p className="text-xs text-gray-400">{timeAgo(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Confirmation Dialog */}
      <Dialog open={confirmSendDialog} onOpenChange={setConfirmSendDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send this invoice?</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{invoice.clientSnapshot.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">{invoice.clientSnapshot.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Due date</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatDate(invoice.dueDate)}</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>The invoice PDF will be attached. The client will also receive a link to view it online.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSendDialog(false)}>Cancel</Button>
            <Button onClick={() => { setConfirmSendDialog(false); handleSend(); }} disabled={loading} className="gap-2">
              <Send className="w-4 h-4" />Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Invoice Dialog */}
      <Dialog open={voidDialog} onOpenChange={setVoidDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel {invoice.invoiceNumber}?</DialogTitle></DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">This invoice will be cancelled. You can reissue a new draft from it at any time.</p>
            <Label>Cancellation Reason *</Label>
            <Textarea className="mt-1.5" placeholder="Enter reason for cancellation..." value={voidReason} onChange={(e) => setVoidReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidDialog(false)}>Keep Invoice</Button>
            <Button variant="destructive" onClick={handleVoid} disabled={loading}>Cancel Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <Label>Amount ({invoice.currency}) *</Label>
              <Input type="number" min="0" step="0.01" className="mt-1.5" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder={formatCurrency(outstanding, invoice.currency)} />
            </div>
            <div>
              <Label>Date Received</Label>
              <Input type="date" className="mt-1.5" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Input className="mt-1.5" placeholder="e.g. Bank transfer, Cheque ref #123" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment} disabled={loading}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
