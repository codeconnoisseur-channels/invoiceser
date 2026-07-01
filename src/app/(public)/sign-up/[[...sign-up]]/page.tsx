import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-violet-700 p-12 text-white">
        <div>
          <Logo textClassName="text-white" />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight">
            Invoicing that gets you paid faster.
          </h1>
          <ul className="space-y-3 text-sm text-blue-100">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
              Unlimited invoices and clients — always free
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
              Auto-reminders so you never chase a payment
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
              Multi-currency support for global freelancers
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
              AI-powered cash flow insights
            </li>
          </ul>
        </div>
        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} Invoiceser. All rights reserved.
        </p>
      </div>
      {/* Form side */}
      <div className="flex items-start lg:items-center justify-center px-6 py-8 sm:py-12 overflow-y-auto min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo textClassName="text-gray-900" />
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-sm text-gray-500 mt-1",
                socialButtonsBlockButton:
                  "border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldInput:
                  "rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all",
                formButtonPrimary:
                  "rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors",
                footerActionLink:
                  "text-sm font-medium text-blue-600 hover:text-blue-700",
                identityPreviewText: "text-sm text-gray-600",
                identityPreviewEditButton: "text-sm text-blue-600 hover:text-blue-700",
                dividerLine: "bg-gray-200",
                dividerText: "text-xs text-gray-400",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
