"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { toast } from "sonner";
import {
  Building2, Receipt, CreditCard, ImagePlus, CheckCircle2, Landmark, Link2,
  Plus, X, Pencil, ChevronDown, ChevronUp, MapPin, Lock, Bell,
} from "lucide-react";
import Link from "next/link";
import { UpgradeButton } from "@/components/upgrade-modal";
import { PhoneInput } from "@/components/phone-input";

// ─── Types ─────────────────────────────────────────────────────────────────────

type PaymentAccountState = {
  id: string;
  label: string;
  currency: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  swift: string;
  paymentLink: string;
  shownOptional: Set<string>;
};

function blankAccount(id?: string): PaymentAccountState {
  return {
    id: id ?? `acc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label: "",
    currency: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    sortCode: "",
    iban: "",
    swift: "",
    paymentLink: "",
    shownOptional: new Set(),
  };
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function Section({
  icon, title, description, children, onSave, saving,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex justify-end">
        <Button onClick={onSave} disabled={saving} size="sm" className="gap-2 h-8">
          {saving ? "Saving…" : <><CheckCircle2 className="w-3.5 h-3.5" />Save</>}
        </Button>
      </div>
    </div>
  );
}

function FieldRow({ label, placeholder, value, onChange, optional = false, type = "text", hint }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; optional?: boolean; type?: string; hint?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}{optional && <span className="ml-1 font-normal text-gray-400 dark:text-gray-500 normal-case">(optional)</span>}
      </Label>
      {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 mb-1">{hint}</p>}
      <Input
        type={type}
        className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Inline form for creating / editing a payment account
function AccountForm({
  account,
  onChange,
  onSave,
  onCancel,
}: {
  account: PaymentAccountState;
  onChange: (updated: PaymentAccountState) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = (field: keyof PaymentAccountState, val: string) =>
    onChange({ ...account, [field]: val });

  const toggleOptional = (key: string, on: boolean) => {
    const s = new Set(account.shownOptional);
    if (on) s.add(key); else { s.delete(key); }
    onChange({ ...account, shownOptional: s, [key]: on ? account[key as keyof PaymentAccountState] as string : "" });
  };

  const { shownOptional } = account;

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/10 p-4 space-y-3 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Account Label <span className="font-normal text-gray-400 normal-case">(optional)</span></Label>
          <Input className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="e.g. GBP Account" value={account.label} onChange={(e) => set("label", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Currency (optional)</Label>
          <Select value={account.currency || "__none"} onValueChange={(v) => set("currency", v === "__none" ? "" : v)}>
            <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">Any</SelectItem>
              {SUPPORTED_CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <FieldRow label="Bank Name" placeholder="Your bank name" value={account.bankName} onChange={(v) => set("bankName", v)} optional />
      <FieldRow label="Account Holder" placeholder="Name on account" value={account.accountHolder} onChange={(v) => set("accountHolder", v)} optional />
      <FieldRow label="Account Number" placeholder="Your account number" value={account.accountNumber} onChange={(v) => set("accountNumber", v)} optional />

      {shownOptional.has("sortCode") && (
        <div className="relative">
          <FieldRow label="Sort Code / Routing" placeholder="e.g. 20-00-00" value={account.sortCode} onChange={(v) => set("sortCode", v)} optional />
          <button onClick={() => toggleOptional("sortCode", false)} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {shownOptional.has("iban") && (
        <div className="relative">
          <FieldRow label="IBAN" placeholder="e.g. GB29 NWBK 6016 1331 9268 19" value={account.iban} onChange={(v) => set("iban", v)} optional />
          <button onClick={() => toggleOptional("iban", false)} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {shownOptional.has("swift") && (
        <div className="relative">
          <FieldRow label="SWIFT / BIC" placeholder="e.g. NWBKGB2L" value={account.swift} onChange={(v) => set("swift", v)} optional />
          <button onClick={() => toggleOptional("swift", false)} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {(!shownOptional.has("sortCode") || !shownOptional.has("iban") || !shownOptional.has("swift")) && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">Add field:</span>
          {!shownOptional.has("sortCode") && (
            <button onClick={() => toggleOptional("sortCode", true)} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1">
              <Plus className="w-3 h-3" />Sort Code / Routing
            </button>
          )}
          {!shownOptional.has("iban") && (
            <button onClick={() => toggleOptional("iban", true)} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1">
              <Plus className="w-3 h-3" />IBAN
            </button>
          )}
          {!shownOptional.has("swift") && (
            <button onClick={() => toggleOptional("swift", true)} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1">
              <Plus className="w-3 h-3" />SWIFT / BIC
            </button>
          )}
        </div>
      )}

      <div className="border-t border-blue-200 dark:border-blue-800 pt-3 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Payment Link (optional)</span>
        </div>
        <FieldRow label="URL" placeholder="e.g. https://paystack.com/pay/yourname" value={account.paymentLink} onChange={(v) => set("paymentLink", v)} optional type="url" />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSave}>
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Save Account
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const settings             = useQuery(api.settings.getSettings);
  const currentUser          = useQuery(api.users.getCurrentUserQuery);
  const isPro                = currentUser?.plan === "pro";
  const logoUrl              = useQuery(api.settings.getLogoUrl, settings?.logoStorageId ? { storageId: settings.logoStorageId } : "skip");
  const updateCompany        = useMutation(api.settings.updateCompanySettings);
  const updateTax            = useMutation(api.settings.updateTaxSettings);
  const updatePaymentDetails = useMutation(api.settings.updatePaymentDetails);
  const updatePayAccounts    = useMutation(api.settings.updatePaymentAccounts);
  const updateReminder       = useMutation(api.settings.updateReminderSettings);
  const generateUploadUrl    = useMutation(api.settings.generateUploadUrl);

  const [business, setBusiness] = useState({
    companyName: "", displayName: "", defaultCurrency: "GBP", invoicePrefix: "INV",
    brandColor: "",
    businessAddress: "", businessCity: "", businessCountry: "",
    businessPhone: "", businessEmail: "", businessWebsite: "",
    showBusinessAddress: true, showBusinessPhone: true,
    showBusinessEmail: true, showBusinessWebsite: true,
    hideBranding: false, invoiceFont: "default",
    customEmailDomain: "", emailTemplate: "",
  });
  const [tax, setTax] = useState({
    salesTaxLabel: "", salesTaxRate: "", salesTaxActive: false,
    vatLabel: "",      vatRate:      "", vatActive:      false,
  });
  const [payment, setPayment] = useState({
    bankName: "", accountName: "", accountNumber: "",
    sortCode: "", iban: "", swiftBic: "", paymentLink: "",
  });
  const [paymentAccounts,    setPaymentAccounts]    = useState<PaymentAccountState[]>([]);
  const [editingAccountId,   setEditingAccountId]   = useState<string | null>(null);
  const [addingAccount,      setAddingAccount]      = useState(false);
  const [newAccount,         setNewAccount]         = useState<PaymentAccountState>(blankAccount());

  const [reminder, setReminder] = useState({
    autoReminderEnabled: false,
    autoReminderDaysBefore: 3,
    autoReminderDaysAfter: 3,
  });
  const [savingBusiness,  setSavingBusiness]  = useState(false);
  const [savingTax,       setSavingTax]       = useState(false);
  const [savingPayment,   setSavingPayment]   = useState(false);
  const [savingReminder,  setSavingReminder]  = useState(false);
  const [uploading,       setUploading]       = useState(false);
  const [shownOptional,   setShownOptional]   = useState<Set<string>>(new Set());
  const [showDefaultAcct, setShowDefaultAcct] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setBusiness({
      companyName:         settings.companyName,
      displayName:         settings.displayName         ?? "",
      defaultCurrency:     settings.defaultCurrency,
      invoicePrefix:       settings.invoicePrefix,
      brandColor:          settings.brandColor          ?? "",
      businessAddress:     settings.businessAddress     ?? "",
      businessCity:        settings.businessCity        ?? "",
      businessCountry:     settings.businessCountry     ?? "",
      businessPhone:       settings.businessPhone       ?? "",
      businessEmail:       settings.businessEmail       ?? "",
      businessWebsite:     settings.businessWebsite     ?? "",
      showBusinessAddress: settings.showBusinessAddress ?? true,
      showBusinessPhone:   settings.showBusinessPhone   ?? true,
      showBusinessEmail:   settings.showBusinessEmail   ?? true,
      showBusinessWebsite: settings.showBusinessWebsite ?? true,
      hideBranding:        (settings as { hideBranding?: boolean }).hideBranding ?? false,
      invoiceFont:         (settings as { invoiceFont?: string }).invoiceFont ?? "default",
      customEmailDomain:   (settings as { customEmailDomain?: string }).customEmailDomain ?? "",
      emailTemplate:       (settings as { emailTemplate?: string }).emailTemplate ?? "",
    });
    setTax({
      salesTaxLabel:  settings.salesTaxLabel ?? "",
      salesTaxRate:   settings.salesTaxRate  != null ? String(settings.salesTaxRate) : "",
      salesTaxActive: settings.salesTaxActive,
      vatLabel:       settings.vatLabel ?? "",
      vatRate:        settings.vatRate   != null ? String(settings.vatRate) : "",
      vatActive:      settings.vatActive,
    });
    setPayment({
      bankName:      settings.paymentBankName      ?? "",
      accountName:   settings.paymentAccountName   ?? "",
      accountNumber: settings.paymentAccountNumber ?? "",
      sortCode:      settings.paymentSortCode      ?? "",
      iban:          settings.paymentIban           ?? "",
      swiftBic:      settings.paymentSwiftBic      ?? "",
      paymentLink:   settings.paymentLink           ?? "",
    });
    const io = new Set<string>();
    if (settings.paymentSortCode) io.add("sortCode");
    if (settings.paymentIban)     io.add("iban");
    if (settings.paymentSwiftBic) io.add("swiftBic");
    setShownOptional(io);

    setReminder({
      autoReminderEnabled:    settings.autoReminderEnabled    ?? false,
      autoReminderDaysBefore: settings.autoReminderDaysBefore ?? 3,
      autoReminderDaysAfter:  settings.autoReminderDaysAfter  ?? 3,
    });

    if (settings.paymentAccounts) {
      setPaymentAccounts(settings.paymentAccounts.map((a) => ({
        ...a,
        sortCode:      a.sortCode      ?? "",
        iban:          a.iban          ?? "",
        swift:         a.swift         ?? "",
        currency:      a.currency      ?? "",
        bankName:      a.bankName      ?? "",
        accountHolder: a.accountHolder ?? "",
        accountNumber: a.accountNumber ?? "",
        paymentLink:   a.paymentLink   ?? "",
        shownOptional: new Set([
          ...(a.sortCode ? ["sortCode"] : []),
          ...(a.iban     ? ["iban"]     : []),
          ...(a.swift    ? ["swift"]    : []),
        ]),
      })));
    }
  }, [settings]);

  async function saveBusiness() {
    if (business.businessWebsite && !business.businessWebsite.startsWith("https://")) {
      toast.error("Website URL must start with https://");
      return;
    }
    try {
      setSavingBusiness(true);
      await updateCompany({
        companyName:         business.companyName,
        displayName:         business.displayName     || undefined,
        defaultCurrency:     business.defaultCurrency,
        invoicePrefix:       business.invoicePrefix,
        brandColor:          business.brandColor      || undefined,
        businessAddress:     business.businessAddress || undefined,
        businessCity:        business.businessCity    || undefined,
        businessCountry:     business.businessCountry || undefined,
        businessPhone:       business.businessPhone   || undefined,
        businessEmail:       business.businessEmail   || undefined,
        businessWebsite:     business.businessWebsite || undefined,
        showBusinessAddress: business.showBusinessAddress,
        showBusinessPhone:   business.showBusinessPhone,
        showBusinessEmail:   business.showBusinessEmail,
        showBusinessWebsite: business.showBusinessWebsite,
        hideBranding:        business.hideBranding,
        invoiceFont:         business.invoiceFont || undefined,
        customEmailDomain:   business.customEmailDomain || undefined,
        emailTemplate:       business.emailTemplate || undefined,
      });
      toast.success("Business profile saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingBusiness(false); }
  }

  async function saveTax() {
    try {
      setSavingTax(true);
      await updateTax({
        salesTaxLabel:  tax.salesTaxLabel || undefined,
        salesTaxRate:   tax.salesTaxRate ? Number(tax.salesTaxRate) : undefined,
        salesTaxActive: tax.salesTaxActive,
        vatLabel:       tax.vatLabel     || undefined,
        vatRate:        tax.vatRate      ? Number(tax.vatRate)      : undefined,
        vatActive:      tax.vatActive,
      });
      toast.success("Tax settings saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingTax(false); }
  }

  async function saveDefaultPayment() {
    try {
      setSavingPayment(true);
      await updatePaymentDetails({
        paymentBankName:      payment.bankName      || undefined,
        paymentAccountName:   payment.accountName   || undefined,
        paymentAccountNumber: payment.accountNumber || undefined,
        paymentSortCode:      payment.sortCode      || undefined,
        paymentIban:          payment.iban           || undefined,
        paymentSwiftBic:      payment.swiftBic      || undefined,
        paymentLink:          payment.paymentLink    || undefined,
      });
      toast.success("Default payment saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingPayment(false); }
  }

  async function savePaymentAccounts(accounts: PaymentAccountState[]) {
    await updatePayAccounts({
      paymentAccounts: accounts.map(({ id, label, currency, bankName, accountHolder, accountNumber, sortCode, iban, swift, paymentLink }) => ({
        id, label,
        currency:      currency      || undefined,
        bankName:      bankName      || undefined,
        accountHolder: accountHolder || undefined,
        accountNumber: accountNumber || undefined,
        sortCode:      sortCode      || undefined,
        iban:          iban          || undefined,
        swift:         swift         || undefined,
        paymentLink:   paymentLink   || undefined,
      })),
    });
  }

  async function saveReminderSettings() {
    try {
      setSavingReminder(true);
      await updateReminder({
        autoReminderEnabled:    reminder.autoReminderEnabled,
        autoReminderDaysBefore: reminder.autoReminderEnabled ? reminder.autoReminderDaysBefore : undefined,
        autoReminderDaysAfter:  reminder.autoReminderEnabled ? reminder.autoReminderDaysAfter  : undefined,
      });
      toast.success("Reminder settings saved");
    } catch { toast.error("Failed to save"); }
    finally { setSavingReminder(false); }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File must be under 2MB"); return; }
    try {
      setUploading(true);
      const url = await generateUploadUrl();
      const res = await fetch(url, { method: "POST", body: file });
      const { storageId } = await res.json();
      await updateCompany({
        companyName: business.companyName,
        logoStorageId: storageId,
        defaultCurrency: business.defaultCurrency,
        invoicePrefix: business.invoicePrefix,
      });
      toast.success("Logo uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  }

  async function handleAddAccount() {
    const accountWithLabel = newAccount.label.trim()
      ? newAccount
      : { ...newAccount, label: [newAccount.bankName, newAccount.currency ? `(${newAccount.currency})` : ""].filter(Boolean).join(" ") || "Account" };
    const updated = [...paymentAccounts, accountWithLabel];
    setPaymentAccounts(updated);
    setAddingAccount(false);
    setNewAccount(blankAccount());
    try { await savePaymentAccounts(updated); toast.success("Account added"); }
    catch { toast.error("Failed to save account"); }
  }

  async function handleSaveEdit(accountId: string, updated: PaymentAccountState) {
    const accounts = paymentAccounts.map((a) => a.id === accountId ? updated : a);
    setPaymentAccounts(accounts);
    setEditingAccountId(null);
    try { await savePaymentAccounts(accounts); toast.success("Account updated"); }
    catch { toast.error("Failed to save account"); }
  }

  async function handleDeleteAccount(accountId: string) {
    const accounts = paymentAccounts.filter((a) => a.id !== accountId);
    setPaymentAccounts(accounts);
    try { await savePaymentAccounts(accounts); toast.success("Account removed"); }
    catch { toast.error("Failed to remove account"); }
  }

  const hasDefaultPayment = payment.bankName || payment.accountNumber || payment.paymentLink;

  if (settings === undefined) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your business profile, invoices, and payment details</p>
      </div>

      {/* Business Profile */}
      <Section
        icon={<Building2 className="w-5 h-5 text-gray-500" />}
        title="Business Profile"
        onSave={saveBusiness}
        saving={savingBusiness}
      >
        {/* Display name */}
        <div>
          <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Display Name</Label>
          <Input
            className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            placeholder=""
            value={business.displayName}
            onChange={(e) => setBusiness((p) => ({ ...p, displayName: e.target.value }))}
          />
        </div>

        <FieldRow
          label="Business Name"
          placeholder=""
          value={business.companyName}
          onChange={(v) => setBusiness((p) => ({ ...p, companyName: v }))}
        />

        {/* Logo — available to all */}
        <div>
          <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Business Logo</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {logoUrl ? (
              <div className="w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600">
                <ImagePlus className="w-5 h-5" />
              </div>
            )}
            <div>
              <label className="cursor-pointer">
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 transition-colors">
                  <ImagePlus className="w-4 h-4" />
                  {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
                </div>
              </label>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WebP · max 2 MB</p>
            </div>
          </div>
        </div>

        {/* Brand color — available to all */}
        <div>
          <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Brand Colour</Label>
          <div className="flex items-center gap-3 mt-1.5">
            <input
              type="color"
              value={business.brandColor || "#2563EB"}
              onChange={(e) => setBusiness((p) => ({ ...p, brandColor: e.target.value }))}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-white dark:bg-gray-800"
            />
            <Input
              className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 font-mono text-sm"
              placeholder="#2563EB"
              value={business.brandColor}
              onChange={(e) => setBusiness((p) => ({ ...p, brandColor: e.target.value }))}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">Accent colour used on invoices</p>
          </div>
        </div>

        {/* Invoice settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Default Currency</Label>
            <Select value={business.defaultCurrency} onValueChange={(v) => setBusiness((p) => ({ ...p, defaultCurrency: v }))}>
              <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Invoice Prefix</Label>
            <Input className="mt-1.5 font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" value={business.invoicePrefix} onChange={(e) => setBusiness((p) => ({ ...p, invoicePrefix: e.target.value }))} placeholder="INV" />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">e.g. INV-2026-0001</p>
          </div>
        </div>
        {/* Business contact — used in invoice header */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Business Contact</span>
          </div>

          <div className="space-y-1">
            <FieldRow label="Street Address" placeholder="" value={business.businessAddress} onChange={(v) => setBusiness((p) => ({ ...p, businessAddress: v }))} />
            <div className="flex items-center gap-2">
              <Switch
                checked={business.showBusinessAddress}
                onCheckedChange={(v) => setBusiness((p) => ({ ...p, showBusinessAddress: v }))}
                className="scale-75"
              />
              <span className="text-[11px] text-gray-400">Show address on invoice</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="City" placeholder="" value={business.businessCity} onChange={(v) => setBusiness((p) => ({ ...p, businessCity: v }))} />
              <FieldRow label="Country" placeholder="" value={business.businessCountry} onChange={(v) => setBusiness((p) => ({ ...p, businessCountry: v }))} />
            </div>
          </div>

          <div className="space-y-1">
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Phone</Label>
              <PhoneInput
                value={business.businessPhone}
                onChange={(v) => setBusiness((p) => ({ ...p, businessPhone: v }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={business.showBusinessPhone}
                onCheckedChange={(v) => setBusiness((p) => ({ ...p, showBusinessPhone: v }))}
                className="scale-75"
              />
              <span className="text-[11px] text-gray-400">Show phone on invoice</span>
            </div>
          </div>

          <div className="space-y-1">
            <FieldRow
              label="Business Email"
              placeholder="hello@yourbusiness.com"
              value={business.businessEmail}
              onChange={(v) => setBusiness((p) => ({ ...p, businessEmail: v }))}
              type="email"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={business.showBusinessEmail}
                onCheckedChange={(v) => setBusiness((p) => ({ ...p, showBusinessEmail: v }))}
                className="scale-75"
              />
              <span className="text-[11px] text-gray-400">Show email on invoice</span>
            </div>
          </div>

          <div className="space-y-1">
            <FieldRow label="Website" placeholder="https://..." value={business.businessWebsite} onChange={(v) => setBusiness((p) => ({ ...p, businessWebsite: v }))} type="url" />
            {business.businessWebsite && !business.businessWebsite.startsWith("https://") && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">URL must start with https://</p>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={business.showBusinessWebsite}
                onCheckedChange={(v) => setBusiness((p) => ({ ...p, showBusinessWebsite: v }))}
                className="scale-75"
              />
              <span className="text-[11px] text-gray-400">Show website on invoice</span>
            </div>
          </div>
        </div>
      </Section>

      {/* White Label — Pro */}
      <Section
        icon={<Lock className="w-5 h-5 text-gray-500" />}
        title="White Label"
        onSave={saveBusiness}
        saving={savingBusiness}
      >
        {!isPro ? (
          <div className="rounded-xl border border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 p-5 space-y-4">
            <ul className="space-y-2">
              {[
                "Remove \"Powered by Invoiceser\" from all invoices",
                "Custom invoice fonts (Modern, Classic, Typewriter)",
                "Custom email domain",
                "Editable email templates",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <UpgradeButton />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Remove branding toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Remove &quot;Powered by Invoiceser&quot;</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Hides the footer branding on all invoices and PDFs</p>
              </div>
              <Switch
                checked={business.hideBranding}
                onCheckedChange={(v) => setBusiness((p) => ({ ...p, hideBranding: v }))}
              />
            </div>

            {/* Invoice font */}
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Invoice Font</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {([
                  { value: "default", label: "Modern",      preview: "Aa" },
                  { value: "serif",   label: "Classic",     preview: "Aa" },
                  { value: "mono",    label: "Typewriter",  preview: "Aa" },
                ] as const).map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setBusiness((p) => ({ ...p, invoiceFont: f.value }))}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-xs ${
                      business.invoiceFont === f.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    <span className={`text-xl font-bold ${f.value === "serif" ? "font-serif" : f.value === "mono" ? "font-mono" : "font-sans"}`}>{f.preview}</span>
                    <span className="font-semibold">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom email domain */}
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Custom Email Domain <span className="font-normal text-gray-400 normal-case">(optional)</span></Label>
              <Input
                className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                placeholder="invoices@yourcompany.com"
                value={business.customEmailDomain}
                onChange={(e) => setBusiness((p) => ({ ...p, customEmailDomain: e.target.value }))}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Requires domain verification via Resend</p>
            </div>

            {/* Email template */}
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email Template <span className="font-normal text-gray-400 normal-case">(optional)</span></Label>
              <textarea
                className="mt-1.5 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={4}
                placeholder="Hi {client_name}, please find your invoice {invoice_number} attached. Total due: {total}."
                value={business.emailTemplate}
                onChange={(e) => setBusiness((p) => ({ ...p, emailTemplate: e.target.value }))}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Use &#123;client_name&#125;, &#123;invoice_number&#125;, &#123;total&#125; as placeholders</p>
            </div>
          </div>
        )}
      </Section>

      {/* Tax */}
      <Section
        icon={<Receipt className="w-5 h-5 text-gray-500" />}
        title="Tax Configuration"
        onSave={saveTax}
        saving={savingTax}
      >
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Sales Tax</p>
            </div>
            <Switch checked={tax.salesTaxActive} onCheckedChange={(v) => setTax((p) => ({ ...p, salesTaxActive: v }))} />
          </div>
          {tax.salesTaxActive && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">Label</Label>
                <Input className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" value={tax.salesTaxLabel} onChange={(e) => setTax((p) => ({ ...p, salesTaxLabel: e.target.value }))} placeholder="Sales Tax" />
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">Rate (%)</Label>
                <Input className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" type="number" min="0" max="100" step="0.01" value={tax.salesTaxRate} onChange={(e) => setTax((p) => ({ ...p, salesTaxRate: e.target.value }))} placeholder="0" />
              </div>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">VAT</p>
            </div>
            <Switch checked={tax.vatActive} onCheckedChange={(v) => setTax((p) => ({ ...p, vatActive: v }))} />
          </div>
          {tax.vatActive && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">Label</Label>
                <Input className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" value={tax.vatLabel} onChange={(e) => setTax((p) => ({ ...p, vatLabel: e.target.value }))} placeholder="VAT" />
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400">Rate (%)</Label>
                <Input className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" type="number" min="0" max="100" step="0.01" value={tax.vatRate} onChange={(e) => setTax((p) => ({ ...p, vatRate: e.target.value }))} placeholder="0" />
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Payment Accounts */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-start gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Payment Accounts</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Save multiple accounts (NGN, USD, GBP…). Select which one appears on each invoice.</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Default account (legacy flat fields) */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setShowDefaultAcct((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-gray-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Default Account</p>
                  {hasDefaultPayment ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.bankName && `${payment.bankName} · `}
                      {payment.accountNumber && `···${payment.accountNumber.slice(-4)}`}
                      {!payment.bankName && !payment.accountNumber && payment.paymentLink && "Payment link set"}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">Not configured — click to add</p>
                  )}
                </div>
              </div>
              {showDefaultAcct ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {showDefaultAcct && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-4 pb-4 pt-3 space-y-3">
                <FieldRow label="Bank Name" placeholder="Your bank name" value={payment.bankName} onChange={(v) => setPayment((p) => ({ ...p, bankName: v }))} optional />
                <FieldRow label="Account Holder" placeholder="Name on account" value={payment.accountName} onChange={(v) => setPayment((p) => ({ ...p, accountName: v }))} optional />
                <FieldRow label="Account Number" placeholder="Your account number" value={payment.accountNumber} onChange={(v) => setPayment((p) => ({ ...p, accountNumber: v }))} optional />

                {shownOptional.has("sortCode") && (
                  <div className="relative">
                    <FieldRow label="Sort Code / Routing Number" placeholder="e.g. 20-00-00 or 021000021" value={payment.sortCode} onChange={(v) => setPayment((p) => ({ ...p, sortCode: v }))} optional />
                    <button onClick={() => { setShownOptional((s) => { const n = new Set(s); n.delete("sortCode"); return n; }); setPayment((p) => ({ ...p, sortCode: "" })); }} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {shownOptional.has("iban") && (
                  <div className="relative">
                    <FieldRow label="IBAN" placeholder="e.g. GB29 NWBK 6016 1331 9268 19" value={payment.iban} onChange={(v) => setPayment((p) => ({ ...p, iban: v }))} optional />
                    <button onClick={() => { setShownOptional((s) => { const n = new Set(s); n.delete("iban"); return n; }); setPayment((p) => ({ ...p, iban: "" })); }} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {shownOptional.has("swiftBic") && (
                  <div className="relative">
                    <FieldRow label="SWIFT / BIC" placeholder="e.g. NWBKGB2L" value={payment.swiftBic} onChange={(v) => setPayment((p) => ({ ...p, swiftBic: v }))} optional />
                    <button onClick={() => { setShownOptional((s) => { const n = new Set(s); n.delete("swiftBic"); return n; }); setPayment((p) => ({ ...p, swiftBic: "" })); }} className="absolute right-0 top-0 text-gray-300 hover:text-rose-500 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {(!shownOptional.has("sortCode") || !shownOptional.has("iban") || !shownOptional.has("swiftBic")) && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Add field:</span>
                    {!shownOptional.has("sortCode") && <button onClick={() => setShownOptional((s) => new Set([...s, "sortCode"]))} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1"><Plus className="w-3 h-3" />Sort Code</button>}
                    {!shownOptional.has("iban") && <button onClick={() => setShownOptional((s) => new Set([...s, "iban"]))} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1"><Plus className="w-3 h-3" />IBAN</button>}
                    {!shownOptional.has("swiftBic") && <button onClick={() => setShownOptional((s) => new Set([...s, "swiftBic"]))} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center gap-1"><Plus className="w-3 h-3" />SWIFT</button>}
                  </div>
                )}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Payment Link (optional)</span>
                  </div>
                  <FieldRow label="URL" placeholder="e.g. https://paystack.com/pay/yourname" value={payment.paymentLink} onChange={(v) => setPayment((p) => ({ ...p, paymentLink: v }))} optional type="url" />
                </div>
                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={saveDefaultPayment} disabled={savingPayment} className="gap-2 h-8">
                    {savingPayment ? "Saving…" : <><CheckCircle2 className="w-3.5 h-3.5" />Save Default</>}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Additional accounts */}
          {paymentAccounts.map((acct) => (
            <div key={acct.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {editingAccountId === acct.id ? (
                <div className="px-4 pb-4 pt-3">
                  <AccountForm
                    account={acct}
                    onChange={(updated) => setPaymentAccounts((prev) => prev.map((a) => a.id === acct.id ? updated : a))}
                    onSave={() => handleSaveEdit(acct.id, acct)}
                    onCancel={() => setEditingAccountId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                      <Landmark className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{acct.label}</p>
                        {acct.currency && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400">{acct.currency}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {acct.bankName && `${acct.bankName} · `}
                        {acct.accountNumber ? `···${acct.accountNumber.slice(-4)}` : acct.paymentLink ? "Payment link" : "No details yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingAccountId(acct.id)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteAccount(acct.id)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new account */}
          {addingAccount ? (
            <AccountForm
              account={newAccount}
              onChange={setNewAccount}
              onSave={handleAddAccount}
              onCancel={() => { setAddingAccount(false); setNewAccount(blankAccount()); }}
            />
          ) : (
            <button
              onClick={() => setAddingAccount(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Plus className="w-4 h-4" />Add another account
            </button>
          )}
        </div>
      </div>

      {/* Automated Reminders */}
      <Section
        icon={<Bell className="w-5 h-5 text-gray-500" />}
        title="Automated Reminders"
        onSave={saveReminderSettings}
        saving={savingReminder}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Send automatic reminders</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Invoiceser emails your clients automatically on your schedule</p>
          </div>
          <Switch
            checked={reminder.autoReminderEnabled}
            onCheckedChange={(v) => setReminder((p) => ({ ...p, autoReminderEnabled: v }))}
          />
        </div>

        {reminder.autoReminderEnabled && (
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Days before due</Label>
              <Select
                value={String(reminder.autoReminderDaysBefore)}
                onValueChange={(v) => setReminder((p) => ({ ...p, autoReminderDaysBefore: Number(v) }))}
              >
                <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} day{n !== 1 ? "s" : ""} before</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Days after due</Label>
              <Select
                value={String(reminder.autoReminderDaysAfter)}
                onValueChange={(v) => setReminder((p) => ({ ...p, autoReminderDaysAfter: Number(v) }))}
              >
                <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} day{n !== 1 ? "s" : ""} after</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Section>

    </div>
  );
}
