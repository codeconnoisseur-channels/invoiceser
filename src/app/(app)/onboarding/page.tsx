"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAnalytics } from "@/lib/use-analytics";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { toast } from "sonner";

type Step = 1 | 2;

export default function OnboardingPage() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [step, setStep] = useState<Step>(1);

  const updateCompany = useMutation(api.settings.updateCompanySettings);

  const [companyName, setCompanyName] = useState("");
  const [currency, setCurrency]       = useState("GBP");
  const [saving, setSaving]           = useState(false);

  async function handleContinue() {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    try {
      setSaving(true);
      await updateCompany({ companyName: companyName.trim(), defaultCurrency: currency, invoicePrefix: "INV" });
      track("onboarding_step_1_completed", { company_name_length: companyName.trim().length });
      setStep(2);
    } catch {
      toast.error("Failed to save — please try again");
    } finally {
      setSaving(false);
    }
  }

  function finish() {
    track("onboarding_completed", {});
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Invoice<span className="text-blue-600">ser</span></span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                step > s
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : step === s
                  ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
              }`}>
                {s}
              </div>
              {s === 1 && (
                <div className={`w-16 h-0.5 mb-0 mx-1 transition-all ${step > 1 ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Business */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Name your business</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">This appears on every invoice you send.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Business Name *</Label>
                <Input
                  className="mt-1.5 h-11 text-base"
                  placeholder="e.g. Jane Doe Design"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Default Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">You can change this later per invoice.</p>
              </div>
            </div>
            <Button onClick={handleContinue} disabled={saving} className="w-full mt-8 h-11 gap-2 text-base">
              {saving ? "Saving…" : "Continue"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Ready */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-full flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">You&apos;re ready to get started</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-sm mx-auto">
              Your business name is set. Now let&apos;s head to the dashboard to finish setting up your account.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8 max-w-sm mx-auto">
              You&apos;ll need to add payment details and a client before you can get paid.
            </p>
            <div className="flex flex-col gap-3">
              <Button className="w-full h-11 gap-2 text-base" onClick={finish}>
                <ArrowRight className="w-4 h-4" /> Go to Dashboard
              </Button>
              <button onClick={() => setStep(1)} className="w-full text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2">
                Back to business name
              </button>
            </div>
          </div>
        )}

        {step < 2 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            You can change everything later in Settings.
          </p>
        )}
      </div>
    </div>
  );
}
