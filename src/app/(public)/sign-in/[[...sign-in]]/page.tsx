import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-violet-700 p-12 text-white">
        <div>
          <Logo textClassName="text-white" />
        </div>
        <div>
          <blockquote className="text-lg font-medium leading-relaxed">
            &ldquo;Invoiceser saved me hours every month. My clients pay faster, and I
            never have to chase invoices manually.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-blue-200">— Alex, Freelance Designer</p>
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
          <SignIn
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
