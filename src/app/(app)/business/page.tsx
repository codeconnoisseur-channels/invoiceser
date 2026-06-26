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
  Building2, ImagePlus, CheckCircle2, MapPin, Link,
} from "lucide-react";
import { PhoneInput } from "@/components/phone-input";

function FieldRow({ label, placeholder, value, onChange, optional = false, type = "text", hint }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; optional?: boolean; type?: string; hint?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
        {label}{optional && <span className="ml-1 font-normal text-muted-foreground normal-case">(optional)</span>}
      </Label>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">{hint}</p>}
      <Input
        type={type}
        className="mt-1.5 bg-white dark:bg-gray-800 border-border"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function BusinessProfilePage() {
  const settings    = useQuery(api.settings.getSettings);
  const logoUrl     = useQuery(api.settings.getLogoUrl, settings?.logoStorageId ? { storageId: settings.logoStorageId } : "skip");
  const updateCompany = useMutation(api.settings.updateCompanySettings);
  const generateUploadUrl = useMutation(api.settings.generateUploadUrl);

  const [business, setBusiness] = useState({
    companyName: "", displayName: "", defaultCurrency: "GBP", invoicePrefix: "INV",
    brandColor: "",
    businessAddress: "", businessCity: "", businessCountry: "",
    businessPhone: "", businessEmail: "", businessWebsite: "",
    showBusinessAddress: true, showBusinessPhone: true,
    showBusinessEmail: true, showBusinessWebsite: true,
    hideBranding: false, invoiceFont: "default",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      hideBranding:        settings.hideBranding        ?? false,
      invoiceFont:         settings.invoiceFont         ?? "default",
    });
  }, [settings]);

  async function save() {
    if (business.businessWebsite && !business.businessWebsite.startsWith("https://")) {
      toast.error("Website URL must start with https://");
      return;
    }
    try {
      setSaving(true);
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
      });
      toast.success("Business profile saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
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

  if (settings === undefined) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Business Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Defaults that auto-fill when creating invoices. Everything is editable per invoice so nothing is locked in.</p>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="flex items-start gap-4 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Company Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">These fields auto-fill the <strong>From</strong> section on new invoices. You can override them on any invoice.</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Display Name</Label>
            <Input
              className="mt-1.5 bg-white dark:bg-gray-800 border-border"
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

          {/* Logo */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Business Logo</Label>
            <div className="mt-1.5 flex items-center gap-3">
              {logoUrl ? (
                <div className="w-14 h-14 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                  <ImagePlus className="w-5 h-5" />
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
                  <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
                  </div>
                </label>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP · max 2 MB</p>
              </div>
            </div>
          </div>

          {/* Brand color */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Brand Colour</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <input
                type="color"
                value={business.brandColor || "#2563EB"}
                onChange={(e) => setBusiness((p) => ({ ...p, brandColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-white dark:bg-gray-800"
              />
              <Input
                className="w-32 bg-white dark:bg-gray-800 border-border font-mono text-sm"
                placeholder="#2563EB"
                value={business.brandColor}
                onChange={(e) => setBusiness((p) => ({ ...p, brandColor: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Accent colour used on invoices</p>
            </div>
          </div>

          {/* Invoice settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Default Currency</Label>
              <Select value={business.defaultCurrency} onValueChange={(v) => setBusiness((p) => ({ ...p, defaultCurrency: v }))}>
                <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Invoice Prefix</Label>
              <Input className="mt-1.5 font-mono bg-white dark:bg-gray-800 border-border" value={business.invoicePrefix} onChange={(e) => setBusiness((p) => ({ ...p, invoicePrefix: e.target.value }))} placeholder="INV" />
              <p className="text-xs text-muted-foreground mt-1">e.g. INV-2026-0001</p>
            </div>
          </div>

          {/* Business contact */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Business Contact</span>
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
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone</Label>
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

          {/* Hide branding */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">Your brand only</p>
              <p className="text-xs text-muted-foreground mt-0.5">No Invoiceser mention appears on your invoices or PDFs</p>
            </div>
            <Switch
              checked={business.hideBranding}
              onCheckedChange={(v) => setBusiness((p) => ({ ...p, hideBranding: v }))}
            />
          </div>

          {/* Invoice font */}
          <div className="pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Invoice Font</Label>
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
                      ? "border-blue-500 bg-primary/10 text-blue-700 dark:text-blue-400"
                      : "border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  <span className={`text-xl font-bold ${f.value === "serif" ? "font-serif" : f.value === "mono" ? "font-mono" : "font-sans"}`}>{f.preview}</span>
                  <span className="font-semibold">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-gray-50/50 dark:bg-gray-800/40 flex justify-end">
          <Button onClick={save} disabled={saving} size="sm" className="gap-2 h-8">
            {saving ? "Saving…" : <><CheckCircle2 className="w-3.5 h-3.5" />Save</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
