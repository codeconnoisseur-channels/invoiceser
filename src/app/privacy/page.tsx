import Link from "next/link";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { Logo } from "@/components/ui/logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-primary-900 selection:text-primary-100">
      {/* Header Bar */}
      <header className="border-b border-gray-800 bg-gray-950 py-6">
        <div className="mx-auto max-w-5xl px-6 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4 items-center">
            <Link href="/sign-in" className="text-sm font-bold text-gray-400 hover:text-white">Login</Link>
            <Link href="/sign-up" className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-bold shadow-sm hover:bg-primary-500 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900/50 py-20 border-b border-gray-800">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-gray-400 font-medium">Last updated on the 27th of June 2026</p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-20 flex flex-col md:flex-row gap-12 items-start">
        {/* Sidebar / ToC */}
        <div className="w-full md:w-64 shrink-0 bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-10">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Table Of Contents</h3>
          <ul className="space-y-2">
            <li>
              <a href="#intro" className="block px-4 py-2.5 rounded-lg bg-primary-500/10 text-primary-400 font-bold text-sm">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#info-collection" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-semibold text-sm transition-colors">
                2. Information We Collect
              </a>
            </li>
            <li>
              <a href="#info-usage" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-semibold text-sm transition-colors">
                3. How We Use Information
              </a>
            </li>
            <li>
              <a href="#sharing" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-semibold text-sm transition-colors">
                4. Data Sharing & Disclosure
              </a>
            </li>
            <li>
              <a href="#security" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-semibold text-sm transition-colors">
                5. Data Security
              </a>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-12">
          <section id="intro" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">1. Introduction</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              At Invoiceser, transparency and trust are the cornerstones of our business. We recognize that as an independent professional or small business owner, you are entrusting us with sensitive financial data, client contact lists, and proprietary business metrics.
            </p>
            <p className="text-gray-400 leading-relaxed">
              This comprehensive Privacy Policy outlines exactly how we collect, process, safeguard, and share your personal and business information when you interact with our website, application, APIs, and related services (collectively referred to as "Invoiceser" or the "Services"). By using our platform, you consent to the practices described in this document.
            </p>
          </section>

          <section id="info-collection" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">2. Information We Collect</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              To provide you with a world-class invoicing experience, we gather information in a few different ways. We only collect what is strictly necessary to deliver, improve, and secure our services.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-400 leading-relaxed">
              <li><strong className="text-gray-200">Account & Profile Data:</strong> When you register, we collect your name, email address, password (securely hashed), business name, and business address. This forms the basis of your Invoiceser identity.</li>
              <li><strong className="text-gray-200">Financial & Payment Data:</strong> While we do not store full credit card numbers directly on our servers (we utilize PCI-compliant partners like Stripe and PayPal), we do store transaction IDs, subscription status, and billing history to maintain your account.</li>
              <li><strong className="text-gray-200">Client Data:</strong> To generate and send invoices on your behalf, we store the names, emails, and addresses of the clients you input into our system. We act solely as a data processor for this information; it remains entirely yours.</li>
              <li><strong className="text-gray-200">Usage Metrics & Telemetry:</strong> We automatically collect diagnostic data such as IP addresses, browser types, interaction times, and feature usage patterns. This helps our engineering team identify bugs, optimize performance, and understand which features deliver the most value.</li>
            </ul>
          </section>

          <section id="info-usage" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">3. How We Use Information</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Your data is the fuel that powers the automation, insights, and reliability of Invoiceser. We leverage the information we collect for several critical business purposes:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-400 leading-relaxed">
              <li><strong className="text-gray-200">Service Delivery:</strong> To generate accurate PDF invoices, execute automated email reminders, calculate tax liabilities, and render your real-time revenue analytics dashboards.</li>
              <li><strong className="text-gray-200">Platform Communication:</strong> To send you essential administrative notices, security alerts, billing confirmations, and carefully curated product updates (which you can opt out of at any time).</li>
              <li><strong className="text-gray-200">Continuous Improvement:</strong> To power our predictive revenue models, train our AI assistant (using anonymized, aggregated data), and refine our user interface based on real-world usage trends.</li>
              <li><strong className="text-gray-200">Security & Compliance:</strong> To proactively detect and prevent fraudulent account creation, unauthorized access attempts, phishing campaigns, and to comply with global regulatory obligations.</li>
            </ul>
          </section>

          <section id="sharing" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">4. Data Sharing & Disclosure</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We never sell your personal data or your client lists to third-party data brokers. We only share information with trusted partners who are strictly vetted and legally bound to uphold stringent privacy standards. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-400 leading-relaxed">
              <li><strong className="text-gray-200">Cloud Infrastructure Providers:</strong> Companies like Vercel and AWS that securely host our application and database environments.</li>
              <li><strong className="text-gray-200">Payment Processors:</strong> Gateways like Stripe that securely process your subscription fees and handle the end-to-end payment flow when your clients settle an invoice.</li>
              <li><strong className="text-gray-200">Communication Services:</strong> Email delivery networks that ensure your invoices and reminders reliably reach your clients' inboxes without being flagged as spam.</li>
            </ul>
          </section>

          <section id="security" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">5. Data Security</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Security is not an afterthought at Invoiceser—it is engineered directly into our architecture. We employ military-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our infrastructure undergoes regular automated vulnerability scanning and annual third-party penetration testing.
            </p>
            <p className="text-gray-400 leading-relaxed">
              However, it is crucial to remember that no electronic transmission over the internet or cloud storage solution is mathematically guaranteed to be 100% secure. You share responsibility for your data by maintaining strong, unique passwords and safeguarding your account credentials.
            </p>
            <p className="text-gray-400 leading-relaxed mt-6 font-medium">
              If you have any questions, concerns, or wish to exercise your rights under GDPR or CCPA regarding your data, please contact our dedicated privacy team at <a href="mailto:privacy@invoiceser.com" className="text-primary-400 hover:text-primary-300 hover:underline">privacy@invoiceser.com</a>.
            </p>
          </section>
        </div>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
