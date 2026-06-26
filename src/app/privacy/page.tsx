import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Invoiceser",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
        <p className="mt-1 text-sm text-gray-500">Last updated: June 2026</p>
        <div className="mt-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>
            Invoiceser (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including your name, email address,
            company details, and financial information necessary for invoicing.
          </p>
          <h2 className="text-base font-semibold text-gray-900">How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our invoicing service,
            process transactions, send invoices and reminders on your behalf, and communicate with you.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2 className="text-base font-semibold text-gray-900">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at support@invoiceser.com.
          </p>
        </div>
      </div>
    </div>
  );
}
