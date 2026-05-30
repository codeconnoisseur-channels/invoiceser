"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileText, Users, CheckCircle2, ArrowRight, Building2, CreditCard, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const updateCompany     = useMutation(api.settings.updateCompanySettings);
  const updatePayment     = useMutation(api.settings.updatePaymentDetails);
  const createClient      = useMutation(api.clients.createClient);

  // Step 1 — Business
  const [companyName, setCompanyName] = useState("");
  const [currency, setCurrency]       = useState("GBP");
  const [savingStep1, setSavingStep1] = useState(false);

  // Step 2 — Payment details
  const [bankName,    setBankName]    = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNum,  setAccountNum]  = useState("");
  const [payLink,     setPayLink]     = useState("");
  const [savingStep2, setSavingStep2] = useState(false);

  // Step 3 — First client
  const [clientName,    setClientName]    = useState("");
  const [clientEmail,   setClientEmail]   = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [savingStep3,   setSavingStep3]   = useState(false);

  async function handleStep1() {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    try {
      setSavingStep1(true);
      await updateCompany({ companyName: companyName.trim(), defaultCurrency: currency, invoicePrefix: "INV" });
      setStep(2);
    } catch { toast.error("Failed to save — please try again"); }
    finally { setSavingStep1(false); }
  }

  async function handleStep2() {
    try {
      setSavingStep2(true);
      await updatePayment({
        paymentBankName:      bankName.trim()    || undefined,
        paymentAccountName:   accountName.trim() || undefined,
        paymentAccountNumber: accountNum.trim()  || undefined,
        paymentLink:          payLink.trim()     || undefined,
      });
      setStep(3);
    } catch { toast.error("Failed to save payment details"); }
    finally { setSavingStep2(false); }
  }

  async function handleStep3() {
    if (!clientName.trim() || !clientEmail.trim()) { toast.error("Name and email are required"); return; }
    try {
      setSavingStep3(true);
      await createClient({ fullName: clientName.trim(), email: clientEmail.trim(), companyName: clientCompany.trim() || undefined });
      setStep(4);
    } catch { toast.error("Failed to add client"); }
    finally { setSavingStep3(false); }
  }

  function finish(goToInvoice = false) {
    if (typeof window !== "undefined") localStorage.setItem("onboarding_dismissed", "1");
    router.push(goToInvoice ? "/invoices/new" : "/dashboard");
  }

  const steps = [
    { number: 1, label: "Business" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Client" },
    { number: 4, label: "Done!" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Invoice<span className="text-blue-600">ser</span></span>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step > s.number
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : step === s.number
                    ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                }`}>
                  {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${step === s.number ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${step > s.number ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Set up your business</h1>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Company or Trading Name *</Label>
                <Input className="mt-1.5 h-11 text-base" placeholder="" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleStep1()} autoFocus />
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
              </div>
            </div>
            <Button onClick={handleStep1} disabled={savingStep1} className="w-full mt-8 h-11 gap-2 text-base">
              {savingStep1 ? "Saving…" : "Continue"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Payment details */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">How should clients pay you?</h1>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 px-4 py-3 mb-5">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Fill in what applies to you — bank transfer, payment link, or both. You can always add more details in Settings later.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bank Transfer</p>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Bank Name</Label>
                  <Input className="mt-1.5 h-10" placeholder="e.g. Access Bank, Barclays, Chase…" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Account Holder Name</Label>
                  <Input className="mt-1.5 h-10" placeholder="e.g. John Smith Consulting" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Account Number</Label>
                  <Input className="mt-1.5 h-10" placeholder="Your account number" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> Online Payment Link
                </p>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Payment URL (optional)</Label>
                  <Input className="mt-1.5 h-10" type="url" placeholder="e.g. https://paystack.com/pay/yourname" value={payLink} onChange={(e) => setPayLink(e.target.value)} />
                </div>
              </div>
            </div>

            <Button onClick={handleStep2} disabled={savingStep2} className="w-full mt-8 h-11 gap-2 text-base">
              {savingStep2 ? "Saving…" : "Save & Continue"} <ArrowRight className="w-4 h-4" />
            </Button>
            <button onClick={() => setStep(3)} className="w-full mt-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2">
              Skip for now — I'll add these in Settings
            </button>
          </div>
        )}

        {/* Step 3 — First client */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add your first client</h1>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Full Name *</Label>
                <Input className="mt-1.5 h-11" placeholder="" value={clientName} onChange={(e) => setClientName(e.target.value)} autoFocus />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email *</Label>
                <Input className="mt-1.5 h-11" type="email" placeholder="" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Company (optional)</Label>
                <Input className="mt-1.5 h-11" placeholder="" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleStep3} disabled={savingStep3} className="w-full mt-8 h-11 gap-2 text-base">
              {savingStep3 ? "Saving…" : "Add Client & Continue"} <ArrowRight className="w-4 h-4" />
            </Button>
            <button onClick={() => setStep(4)} className="w-full mt-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">You&apos;re all set! 🎉</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-sm mx-auto">
              Your account is ready. Your payment details will automatically appear on every invoice — no manual entry needed.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8 max-w-sm mx-auto">
              You can add more payment methods (sort code, IBAN, SWIFT) anytime in Settings.
            </p>
            <div className="flex flex-col gap-3">
              <Button className="w-full h-11 gap-2 text-base" onClick={() => finish(true)}>
                <FileText className="w-4 h-4" />Create First Invoice
              </Button>
              <Button variant="outline" className="w-full h-11" onClick={() => finish(false)}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          {step <= 2 ? "Your details are private and only shown on your invoices." : "You can change everything later in Settings."}
        </p>
      </div>
    </div>
  );
}
