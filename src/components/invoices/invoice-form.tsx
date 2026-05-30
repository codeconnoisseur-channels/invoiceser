"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Plus, Trash2, Send, AlertCircle,
  User, Building2, FileText, CalendarDays, CreditCard, StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/lib/dates";
import { InvoicePreview } from "@/components/invoices/invoice-preview";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  description: string;
  qtyStr: string;
  rateStr: string;
  quantity: number;
  rate: number;
  amount: number;
}

const defaultLineItem = (): LineItem => ({
  description: "", qtyStr: "1", rateStr: "", quantity: 1, rate: 0, amount: 0,
});

function fromExistingLineItem(li: { description: string; quantity: number; rate: number; amount?: number }): LineItem {
  return {
    description: li.description,
    qtyStr:  String(li.quantity),
    rateStr: li.rate === 0 ? "" : String(li.rate),
    quantity: li.quantity,
    rate:     li.rate,
    amount:   li.amount ?? li.quantity * li.rate,
  };
}

type RawLineItem = { description: string; quantity: number; rate: number; amount: number };

function toRawLineItems(items: LineItem[]): RawLineItem[] {
  return items.map(({ description, quantity, rate, amount }) => ({ description, quantity, rate, amount }));
}

interface ExistingInvoice {
  _id: Id<"invoices">;
  clientId?: Id<"clients">;
  clientSnapshot: { fullName: string; email: string; companyName?: string; address?: string };
  currency: string;
  issueDate: string;
  dueDate?: string;
  paymentTerms?: string;
  lineItems: RawLineItem[];
  subtotal: number;
  salesTaxEnabled: boolean;
  salesTaxLabel?: string;
  salesTaxRate?: number;
  salesTaxAmount?: number;
  vatEnabled: boolean;
  vatLabel?: string;
  vatRate?: number;
  vatAmount?: number;
  total: number;
  notes?: string;
  paymentInstructions?: string;
}

const PAYMENT_TERMS = [
  { value: "due_on_receipt", label: "Due on receipt", days: 0 },
  { value: "net_7",          label: "Net 7",           days: 7 },
  { value: "net_15",         label: "Net 15",          days: 15 },
  { value: "net_30",         label: "Net 30",          days: 30 },
  { value: "net_45",         label: "Net 45",          days: 45 },
  { value: "net_60",         label: "Net 60",          days: 60 },
];

function dueDateFromTerms(issueDate: string, days: number): string {
  const d = new Date(issueDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function accountToInstructions(a: {
  bankName?: string; accountHolder?: string; accountNumber?: string;
  sortCode?: string; iban?: string; swift?: string;
  paymentLink?: string; paymentLinkLabel?: string;
}): string {
  const parts: string[] = [];
  if (a.bankName)         parts.push(`Bank: ${a.bankName}`);
  if (a.accountHolder)    parts.push(`Account name: ${a.accountHolder}`);
  if (a.accountNumber)    parts.push(`Account no: ${a.accountNumber}`);
  if (a.sortCode)         parts.push(`Sort code: ${a.sortCode}`);
  if (a.iban)             parts.push(`IBAN: ${a.iban}`);
  if (a.swift)            parts.push(`SWIFT/BIC: ${a.swift}`);
  if (a.paymentLink) {
    const label = a.paymentLinkLabel || "Pay online";
    parts.push(`${label}: ${a.paymentLink}`);
  }
  return parts.join("\n");
}

// ─── Auto-resize textarea helper ───────────────────────────────────────────────

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

// ─── Main form ─────────────────────────────────────────────────────────────────

export function InvoiceForm({
  invoiceId,
  existingInvoice,
  initialClientId,
}: {
  invoiceId?: Id<"invoices">;
  existingInvoice?: ExistingInvoice;
  initialClientId?: string;
}) {
  const router = useRouter();
  const isEditing = !!invoiceId && !!existingInvoice;

  const settings  = useQuery(api.settings.getSettings);
  const logoUrl   = useQuery(api.settings.getLogoUrl, settings?.logoStorageId ? { storageId: settings.logoStorageId } : "skip");
  const clients   = useQuery(api.clients.listClients);
  const templates = useQuery(api.lineItemTemplates.listTemplates);
  const createInvoice      = useMutation(api.invoices.createInvoice);
  const updateDraftInvoice = useMutation(api.invoices.updateDraftInvoice);

  const [clientId,         setClientId]         = useState<string>(initialClientId ?? "new");
  const [newRecipient,     setNewRecipient]      = useState({ fullName: "", email: "", companyName: "", address: "", clientType: "individual" as "individual" | "business" });
  const [currency,         setCurrency]          = useState("GBP");
  const [paymentTerms,     setPaymentTerms]      = useState("");
  const [issueDate,        setIssueDate]         = useState(new Date().toISOString().split("T")[0]);
  const [dueDate,          setDueDate]           = useState("");
  const [lineItems,        setLineItems]         = useState<LineItem[]>([defaultLineItem()]);
  const [salesTaxEnabled,  setSalesTaxEnabled]   = useState(false);
  const [vatEnabled,       setVatEnabled]        = useState(false);
  const [notes,            setNotes]             = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [selectedAccountId,   setSelectedAccountId]   = useState<string>("__default__");
  const [includePaymentLink,  setIncludePaymentLink]  = useState(true);
  const [saving,              setSaving]              = useState(false);
  const [confirmSend,      setConfirmSend]       = useState(false);

  const defaultAccountExists = !!(
    settings?.paymentBankName || settings?.paymentAccountNumber || settings?.paymentLink
  );
  const allAccounts: Array<{ id: string; label: string; instructions: string; instructionsNoLink: string; hasLink: boolean }> = [
    ...(defaultAccountExists
      ? [{
          id: "__default__",
          label: settings?.paymentBankName
            ? settings.paymentBankName + (settings.paymentAccountNumber ? ` ···${settings.paymentAccountNumber.slice(-4)}` : "")
            : "Default Account",
          instructions: accountToInstructions({
            bankName:      settings?.paymentBankName,
            accountHolder: settings?.paymentAccountName,
            accountNumber: settings?.paymentAccountNumber,
            sortCode:      settings?.paymentSortCode,
            iban:          settings?.paymentIban,
            swift:         settings?.paymentSwiftBic,
            paymentLink:   settings?.paymentLink,
            paymentLinkLabel: settings?.paymentLinkLabel,
          }),
          instructionsNoLink: accountToInstructions({
            bankName:      settings?.paymentBankName,
            accountHolder: settings?.paymentAccountName,
            accountNumber: settings?.paymentAccountNumber,
            sortCode:      settings?.paymentSortCode,
            iban:          settings?.paymentIban,
            swift:         settings?.paymentSwiftBic,
          }),
          hasLink: !!settings?.paymentLink,
        }]
      : []),
    ...(settings?.paymentAccounts ?? []).map((a) => ({
      id: a.id,
      label: a.label + (a.currency ? ` (${a.currency})` : ""),
      instructions: accountToInstructions(a),
      instructionsNoLink: accountToInstructions({ ...a, paymentLink: undefined, paymentLinkLabel: undefined }),
      hasLink: !!a.paymentLink,
    })),
    { id: "__custom__", label: "Custom / type below", instructions: "", instructionsNoLink: "", hasLink: false },
  ];

  const selectedAccountHasLink = allAccounts.find((a) => a.id === selectedAccountId)?.hasLink ?? false;

  useEffect(() => {
    if (isEditing && existingInvoice) {
      const inv = existingInvoice;
      if (inv.clientId) {
        setClientId(inv.clientId);
      } else {
        setClientId("new");
        setNewRecipient({
          fullName: inv.clientSnapshot.fullName,
          email: inv.clientSnapshot.email,
          companyName: inv.clientSnapshot.companyName ?? "",
          address: inv.clientSnapshot.address ?? "",
          clientType: inv.clientSnapshot.companyName ? "business" : "individual",
        });
      }
      setCurrency(inv.currency);
      setPaymentTerms(inv.paymentTerms ?? "");
      setIssueDate(inv.issueDate);
      setDueDate(inv.dueDate ?? "");
      setLineItems(inv.lineItems.map(fromExistingLineItem));
      setSalesTaxEnabled(inv.salesTaxEnabled);
      setVatEnabled(inv.vatEnabled);
      setNotes(inv.notes ?? "");
      setPaymentInstructions(inv.paymentInstructions ?? "");
      setSelectedAccountId("__custom__");
    } else if (settings && !isEditing) {
      setCurrency(settings.defaultCurrency);
      setSalesTaxEnabled(settings.salesTaxActive);
      setVatEnabled(settings.vatActive);

      const instructions = settings.paymentInstructions || accountToInstructions({
        bankName:      settings.paymentBankName,
        accountHolder: settings.paymentAccountName,
        accountNumber: settings.paymentAccountNumber,
        sortCode:      settings.paymentSortCode,
        iban:          settings.paymentIban,
        swift:         settings.paymentSwiftBic,
        paymentLink:   settings.paymentLink,
        paymentLinkLabel: settings.paymentLinkLabel,
      });
      setPaymentInstructions(instructions);
    }
  }, [settings, isEditing, existingInvoice]);

  const subtotal       = lineItems.reduce((s, i) => s + i.amount, 0);
  const salesTaxAmount = salesTaxEnabled && settings?.salesTaxRate ? (subtotal * settings.salesTaxRate) / 100 : 0;
  const vatAmount      = vatEnabled && settings?.vatRate ? (subtotal * settings.vatRate) / 100 : 0;
  const total          = subtotal + salesTaxAmount + vatAmount;
  const hasTax         = salesTaxEnabled || vatEnabled;

  function updateLineItemStr(idx: number, field: "qtyStr" | "rateStr", raw: string) {
    setLineItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[idx], [field]: raw };
      item.quantity = field === "qtyStr" ? (parseFloat(raw) || 0) : item.quantity;
      item.rate     = field === "rateStr" ? (parseFloat(raw) || 0) : item.rate;
      item.amount   = item.quantity * item.rate;
      updated[idx] = item;
      return updated;
    });
  }

  function blurLineItemStr(idx: number, field: "qtyStr" | "rateStr") {
    setLineItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[idx] };
      if (field === "qtyStr" && item.qtyStr.trim() === "") { item.qtyStr = "1"; item.quantity = 1; }
      if (field === "rateStr" && item.rateStr.trim() === "") { item.rateStr = ""; item.rate = 0; }
      item.amount = item.quantity * item.rate;
      updated[idx] = item;
      return updated;
    });
  }

  function updateLineItemDesc(idx: number, val: string) {
    setLineItems((prev) => { const u = [...prev]; u[idx] = { ...u[idx], description: val }; return u; });
  }

  function applyTemplate(templateId: string) {
    const t = templates?.find((t) => t._id === templateId);
    if (t) setLineItems(t.lineItems.map(fromExistingLineItem));
  }

  function applyAccountInstructions(acctId: string, withLink: boolean) {
    if (acctId === "__custom__") return;
    const acct = allAccounts.find((a) => a.id === acctId);
    if (!acct) return;
    setPaymentInstructions(withLink ? acct.instructions : acct.instructionsNoLink);
  }

  function handleAccountSelect(accountId: string) {
    setSelectedAccountId(accountId);
    applyAccountInstructions(accountId, includePaymentLink);
  }

  function handleLinkToggle(include: boolean) {
    setIncludePaymentLink(include);
    applyAccountInstructions(selectedAccountId, include);
  }

  const activeClients = (clients as Array<{ _id: string; fullName: string; email: string; companyName?: string; address?: string; deletedAt?: number }> | undefined)?.filter((c) => !c.deletedAt) ?? [];

  function getClientSnapshot() {
    if (clientId === "new") {
      return {
        fullName: newRecipient.fullName,
        email: newRecipient.email,
        companyName: newRecipient.clientType === "business" ? (newRecipient.companyName || undefined) : undefined,
        address: newRecipient.clientType === "business" ? (newRecipient.address || undefined) : undefined,
      };
    }
    const c = activeClients.find((c) => c._id === clientId);
    if (!c) throw new Error("Client not found");
    return { fullName: c.fullName, email: c.email, companyName: c.companyName, address: c.address };
  }

  function getClientEmail() {
    if (clientId === "new") return newRecipient.email;
    return activeClients.find((c) => c._id === clientId)?.email ?? "";
  }

  function baseArgs() {
    if (!settings) throw new Error("Settings not loaded");
    const snapshot = getClientSnapshot();
    return {
      clientId:            clientId !== "new" ? (clientId as Id<"clients">) : undefined,
      clientSnapshot:      snapshot,
      currency,
      paymentTerms:        paymentTerms || undefined,
      issueDate,
      dueDate:             dueDate || undefined,
      lineItems:           toRawLineItems(lineItems),
      subtotal,
      salesTaxEnabled,
      salesTaxLabel:       settings.salesTaxLabel,
      salesTaxRate:        settings.salesTaxRate,
      salesTaxAmount:      salesTaxEnabled ? salesTaxAmount : undefined,
      vatEnabled,
      vatLabel:            settings.vatLabel,
      vatRate:             settings.vatRate,
      vatAmount:           vatEnabled ? vatAmount : undefined,
      total,
      notes:               notes               || undefined,
      paymentInstructions: paymentInstructions || undefined,
    } as const;
  }

  async function executeSend() {
    if (!settings) return;
    try {
      setSaving(true); setConfirmSend(false);
      let finalId: string;
      if (isEditing && invoiceId) {
        await updateDraftInvoice({ invoiceId, ...baseArgs() });
        finalId = invoiceId;
      } else {
        const r = await createInvoice({ ...baseArgs(), asDraft: false });
        finalId = r.invoiceId;
      }
      await fetch("/api/email/send-invoice", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: finalId }),
      });
      toast.success("Invoice sent!");
      router.push(`/invoices/${finalId}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e?.message ?? "Failed to send invoice");
    } finally { setSaving(false); }
  }

  async function handleSaveDraft() {
    if (!settings) return;
    try {
      setSaving(true);
      if (isEditing && invoiceId) {
        await updateDraftInvoice({ invoiceId, ...baseArgs() });
        toast.success("Draft updated");
        router.push(`/invoices/${invoiceId}`);
      } else {
        const r = await createInvoice({ ...baseArgs(), asDraft: true });
        toast.success("Draft saved");
        router.push(`/invoices/${r.invoiceId}`);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e?.message ?? "Failed to save draft");
    } finally { setSaving(false); }
  }

  // Preview-computed values
  const selectedClient = activeClients.find((c) => c._id === clientId);
  const previewClientName = clientId === "new"
    ? (newRecipient.fullName || "Client Name")
    : (selectedClient?.fullName ?? "Client Name");
  const previewCompany = clientId === "new"
    ? (newRecipient.clientType === "business" ? newRecipient.companyName : "")
    : (selectedClient?.companyName ?? "");
  const previewAddress = clientId === "new"
    ? (newRecipient.clientType === "business" ? newRecipient.address : "")
    : (selectedClient?.address ?? "");
  const previewEmail = clientId === "new"
    ? newRecipient.email
    : (selectedClient?.email ?? "");
  const previewInvoiceNum = settings
    ? `${settings.invoicePrefix}-${String(settings.invoiceCounter + 1).padStart(4, "0")}`
    : "INV-0001";

  const recipientName  = previewClientName;
  const recipientEmail = getClientEmail();

  return (
    <div className="lg:grid lg:grid-cols-[460px_1fr] lg:gap-0 space-y-6 lg:space-y-0">

      {/* ── LEFT: Form ─────────────────────────────────────────────────── */}
      <div className="lg:h-[calc(100vh-144px)] lg:overflow-y-auto lg:pr-6 space-y-5 lg:pb-10">

        {/* From (read-only) */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">From</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{settings?.companyName || "—"}</p>
          {!settings?.companyName && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <a href="/settings" className="underline">Add your business name in Settings</a>
            </p>
          )}
        </div>

        {/* Bill To */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bill To</p>
          </div>
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="mt-1.5 h-9">
                <SelectValue placeholder="Select a client…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New recipient</SelectItem>
                {activeClients.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.companyName ? c.companyName : c.fullName}
                    {c.companyName ? ` · ${c.fullName}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {clientId === "new" && (
            <div className="space-y-3">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 gap-0.5">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-md transition-all ${
                    newRecipient.clientType === "individual"
                      ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setNewRecipient((p) => ({ ...p, clientType: "individual", companyName: "", address: "" }))}
                >
                  <User className="w-3 h-3" /> Individual
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-md transition-all ${
                    newRecipient.clientType === "business"
                      ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setNewRecipient((p) => ({ ...p, clientType: "business" }))}
                >
                  <Building2 className="w-3 h-3" /> Business
                </button>
              </div>

              {newRecipient.clientType === "individual" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Full Name *</Label>
                    <Input className="mt-1 h-9" placeholder="" value={newRecipient.fullName} onChange={(e) => setNewRecipient((p) => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Email *</Label>
                    <Input className="mt-1 h-9" type="email" placeholder="" value={newRecipient.email} onChange={(e) => setNewRecipient((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Business Name *</Label>
                    <Input className="mt-1 h-9" placeholder="" value={newRecipient.companyName} onChange={(e) => setNewRecipient((p) => ({ ...p, companyName: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Contact Person *</Label>
                      <Input className="mt-1 h-9" placeholder="" value={newRecipient.fullName} onChange={(e) => setNewRecipient((p) => ({ ...p, fullName: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Email *</Label>
                      <Input className="mt-1 h-9" type="email" placeholder="" value={newRecipient.email} onChange={(e) => setNewRecipient((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Business Address <span className="text-gray-400 font-normal">(optional)</span></Label>
                    <Input className="mt-1 h-9" placeholder="" value={newRecipient.address} onChange={(e) => setNewRecipient((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Invoice Details */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Invoice Details</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="mt-1.5 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Payment Terms</Label>
              <Select
                value={paymentTerms || "__none"}
                onValueChange={(v) => {
                  const term = v === "__none" ? "" : v;
                  setPaymentTerms(term);
                  if (term) {
                    const termDef = PAYMENT_TERMS.find((t) => t.value === term);
                    if (termDef) setDueDate(dueDateFromTerms(issueDate, termDef.days));
                  }
                }}
              >
                <SelectTrigger className="mt-1.5 h-9"><SelectValue placeholder="Select terms…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {PAYMENT_TERMS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Issue Date</Label>
              <Input
                type="date"
                className="mt-1.5 h-9"
                value={issueDate}
                onChange={(e) => {
                  setIssueDate(e.target.value);
                  if (paymentTerms) {
                    const termDef = PAYMENT_TERMS.find((t) => t.value === paymentTerms);
                    if (termDef) setDueDate(dueDateFromTerms(e.target.value, termDef.days));
                  }
                }}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Due Date</Label>
              <Input type="date" className="mt-1.5 h-9" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Items</p>
            </div>
            {templates && templates.length > 0 && (
              <Select onValueChange={applyTemplate}>
                <SelectTrigger className="w-40 h-7 text-xs"><SelectValue placeholder="Use template…" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          {lineItems.map((item, idx) => (
            <div key={idx} className="space-y-1.5 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
              {/* Row 1: Description */}
              <div className="flex gap-1.5 items-start">
                <textarea
                  className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  style={{ minHeight: "36px", height: "36px", resize: "none", overflow: "hidden" }}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItemDesc(idx, e.target.value)}
                  onInput={(e) => autoResize(e.currentTarget)}
                  rows={1}
                />
                <button
                  className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-rose-500 rounded mt-0.5 shrink-0"
                  onClick={() => setLineItems((p) => p.filter((_, i) => i !== idx))}
                  disabled={lineItems.length === 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Row 2: Qty, Rate, Amount */}
              <div className="flex items-center gap-3">
                <div className="w-20">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Qty</p>
                  <Input className="h-8 text-xs" inputMode="decimal" placeholder="1" value={item.qtyStr} onChange={(e) => updateLineItemStr(idx, "qtyStr", e.target.value)} onBlur={() => blurLineItemStr(idx, "qtyStr")} />
                </div>
                <div className="w-28">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Rate</p>
                  <Input className="h-8 text-xs" inputMode="decimal" placeholder="0.00" value={item.rateStr} onChange={(e) => updateLineItemStr(idx, "rateStr", e.target.value)} onBlur={() => blurLineItemStr(idx, "rateStr")} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Amount</p>
                  <p className="text-sm tabular-nums font-semibold text-gray-800 dark:text-gray-200 h-8 flex items-center justify-end">{formatCurrency(item.amount, currency)}</p>
                </div>
              </div>
            </div>
          ))}

          <button
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
            onClick={() => setLineItems((p) => [...p, defaultLineItem()])}
          >
            <Plus className="w-3.5 h-3.5" />Add item
          </button>

          {/* Totals */}
          <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5">
            {hasTax && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal, currency)}</span>
              </div>
            )}
            {settings?.salesTaxRate != null && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={salesTaxEnabled} onCheckedChange={(v) => setSalesTaxEnabled(!!v)} />
                  <span className="text-gray-600 dark:text-gray-400">{settings.salesTaxLabel ?? "Sales Tax"} ({settings.salesTaxRate}%)</span>
                </label>
                {salesTaxEnabled && <span className="tabular-nums text-gray-700 dark:text-gray-300">{formatCurrency(salesTaxAmount, currency)}</span>}
              </div>
            )}
            {settings?.vatRate != null && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={vatEnabled} onCheckedChange={(v) => setVatEnabled(!!v)} />
                  <span className="text-gray-600 dark:text-gray-400">{settings.vatLabel ?? "VAT"} ({settings.vatRate}%)</span>
                </label>
                {vatEnabled && <span className="tabular-nums text-gray-700 dark:text-gray-300">{formatCurrency(vatAmount, currency)}</span>}
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100 pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Payment Details</p>
          </div>

          {allAccounts.length > 1 && (
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Account</Label>
              <Select value={selectedAccountId} onValueChange={handleAccountSelect}>
                <SelectTrigger className="mt-1.5 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allAccounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAccountHasLink && (
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <Checkbox checked={includePaymentLink} onCheckedChange={(v) => handleLinkToggle(!!v)} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Include payment link</span>
                </label>
              )}
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              {allAccounts.length > 1 ? "Payment instructions (auto-filled)" : "Payment Instructions"}
            </Label>
            <Textarea
              className="mt-1.5 text-sm"
              placeholder="Bank name, account number, payment link…"
              value={paymentInstructions}
              onChange={(e) => { setPaymentInstructions(e.target.value); setSelectedAccountId("__custom__"); }}
              rows={4}
            />
            {!paymentInstructions && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <a href="/settings" className="underline font-medium">Add payment accounts in Settings</a> so they auto-fill here.
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <StickyNote className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Notes</p>
          </div>
          <Textarea
            className="text-sm"
            placeholder="Add a note for your client"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 py-4">
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {isEditing ? "Update Draft" : "Save as Draft"}
          </Button>
          <Button onClick={() => setConfirmSend(true)} disabled={saving} className="gap-2">
            <Send className="w-4 h-4" />Send Invoice
          </Button>
        </div>
      </div>

      {/* ── RIGHT: A4 Invoice Preview ─────────────────────────────────── */}
      <div className="hidden lg:block lg:pl-6 lg:border-l lg:border-gray-100 lg:dark:border-gray-800 lg:h-[calc(100vh-144px)] lg:overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Invoice Preview</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">Updates as you type</p>
        </div>
        <InvoicePreview
          companyName={settings?.companyName ?? ""}
          logoUrl={logoUrl}
          brandColor={settings?.brandColor ?? "#2563EB"}
          hideBranding={false}
          invoiceFont={settings?.invoiceFont}
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
          invoiceNumber={previewInvoiceNum}
          issueDate={issueDate}
          dueDate={dueDate || undefined}
          clientName={previewClientName}
          clientCompany={previewCompany ?? ""}
          clientAddress={previewAddress ?? ""}
          clientEmail={previewEmail}
          lineItems={lineItems}
          currency={currency}
          hasTax={hasTax}
          subtotal={subtotal}
          salesTaxEnabled={salesTaxEnabled}
          salesTaxAmount={salesTaxAmount}
          salesTaxLabel={settings?.salesTaxLabel ?? "Sales Tax"}
          salesTaxRate={settings?.salesTaxRate ?? 0}
          vatEnabled={vatEnabled}
          vatAmount={vatAmount}
          vatLabel={settings?.vatLabel ?? "VAT"}
          vatRate={settings?.vatRate ?? 0}
          total={total}
          paymentInstructions={paymentInstructions}
          notes={notes}
        />
      </div>

      {/* Send confirmation */}
      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send this invoice?</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">{recipientEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="tabular-nums font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(total, currency)}</span>
              </div>
              {dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Due date</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatDate(dueDate)}</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>The invoice PDF will be attached to the email. The client will receive a link to view it online.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSend(false)}>Cancel</Button>
            <Button onClick={executeSend} disabled={saving} className="gap-2">
              <Send className="w-4 h-4" />{saving ? "Sending…" : "Send Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
