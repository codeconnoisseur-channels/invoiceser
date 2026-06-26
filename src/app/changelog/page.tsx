import type { Metadata } from "next";
import { FileText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog | Invoiceser",
};

const entries = [
  {
    date: "June 26, 2026",
    version: "1.2.0",
    items: [
      "Free tier AI queries increased from 10 to 50 per month",
      "Hide branding (no 'Powered by Invoiceser') now available on free plan",
      "Custom invoice fonts (Modern, Classic, Typewriter) now free",
      "Settings page split into tabs: General, Tax, Payments, Reminders",
      "Email preview in send confirmation dialog",
      "Sticky Pay Now bar on public invoice page",
      "PDF download for clients on public invoice page",
      "CSV export for invoices",
      "Undo for void invoice and delete client actions",
      "Onboarding reduced from 4 steps to 2",
      "Dashboard shows guided empty state for new users",
      "Client list pagination (25 per page, show more)",
      "Loading skeletons on AI chat page",
      "404 and error boundary pages added",
      "Branded sign-in/sign-up pages",
      "Footer links cleaned up (removed broken pages, created Privacy & Terms)",
    ],
  },
  {
    date: "May 15, 2026",
    version: "1.1.0",
    items: [
      "Product tour for first-time users",
      "Dashboard aggregated counters",
      "Paginated invoice list (show more)",
      "Last active tracking on user profiles",
      "Gmail SMTP email delivery (replaced Resend)",
    ],
  },
  {
    date: "April 28, 2026",
    version: "1.0.0",
    items: [
      "Initial release",
      "Invoice creation, editing, and management",
      "Client management",
      "Email delivery with PDF attachments",
      "Multi-currency support (14 currencies)",
      "Sales tax and VAT support",
      "Payment tracking",
      "Automated payment reminders",
      "Analytics dashboard with charts",
      "AI-powered cash flow assistant",
      "Public invoice pages",
      "Starter and Pro subscription plans",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
              Invoice<span className="text-blue-600">ser</span>
            </Link>
          </div>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Changelog</h1>
        <p className="mt-1 text-sm text-gray-500">Updates and improvements to Invoiceser.</p>

        <div className="mt-10 space-y-12">
          {entries.map((entry) => (
            <div key={entry.version}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900">{entry.version}</h2>
                <span className="text-xs text-gray-400">{entry.date}</span>
              </div>
              <ul className="space-y-2">
                {entry.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
