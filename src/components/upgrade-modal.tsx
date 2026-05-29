"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart2, Mail, Palette, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PRO_FEATURES = [
  { icon: <BarChart2 className="w-4 h-4" />, text: "Predictive analytics & revenue forecasts" },
  { icon: <Sparkles className="w-4 h-4" />, text: "Unlimited AI chat queries" },
  { icon: <Palette className="w-4 h-4" />, text: "Full white-label control (remove branding, custom fonts, email templates)" },
  { icon: <Mail className="w-4 h-4" />, text: "Custom email domain" },
];

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const upgradeToPro = useMutation(api.users.selfUpgradeToPro);

  async function handleUpgrade() {
    setLoading(true);
    try {
      await upgradeToPro({});
      toast.success("You're now on Pro!");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <DialogTitle className="text-lg font-extrabold">Upgrade to Pro</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Unlock the full Invoiceser experience with Pro.
        </p>

        <ul className="space-y-3 mb-6">
          {PRO_FEATURES.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400 mt-0.5">
                {f.icon}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{f.text}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Everything in Free, plus all Pro features — forever.
          </p>
        </div>

        <Button
          className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2"
          onClick={handleUpgrade}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Activating…" : "Activate Pro"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function UpgradeButton({ label = "Upgrade to Pro", className }: { label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? "shrink-0 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors gap-1.5 flex items-center"}
      >
        <Sparkles className="w-3 h-3" />
        {label}
      </button>
      <UpgradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
