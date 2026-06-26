import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Invoiceser",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
        <p className="mt-1 text-sm text-gray-500">Last updated: June 2026</p>
        <div className="mt-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>
            By using Invoiceser (&ldquo;the Service&rdquo;), you agree to these Terms of Service.
            If you do not agree, do not use the Service.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Use of Service</h2>
          <p>
            You may use the Service only for lawful purposes and in accordance with these Terms.
            You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Payments and Billing</h2>
          <p>
            Paid plans are billed in advance on a monthly basis. Cancellation takes effect at the end
            of the current billing period. Refunds are provided at our discretion.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Limitation of Liability</h2>
          <p>
            Invoiceser shall not be liable for any indirect, incidental, or consequential damages
            arising from your use of the Service.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Contact</h2>
          <p>
            For questions about these Terms, contact us at support@invoiceser.com.
          </p>
        </div>
      </div>
    </div>
  );
}
