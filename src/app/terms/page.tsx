import Link from "next/link";
import { Receipt } from "lucide-react";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <header className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto max-w-5xl px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Invoice<span className="text-primary-600">ser</span>
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/sign-up" className="text-sm font-bold text-primary-600 hover:text-primary-700">Login</Link>
            <Link href="/sign-up" className="px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-bold shadow-sm hover:bg-primary-800 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-50/50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-gray-600 font-medium">Last updated on the 27th of June 2026</p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-20 flex flex-col md:flex-row gap-12 items-start">
        {/* Sidebar / ToC */}
        <div className="w-full md:w-64 shrink-0 bg-gray-50/50 rounded-2xl p-6 border border-gray-100 sticky top-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Table Of Contents</h3>
          <ul className="space-y-2">
            <li>
              <a href="#intro" className="block px-4 py-2.5 rounded-lg bg-primary-50/80 text-primary-700 font-bold text-sm">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#user-accounts" className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors">
                2. User Accounts & Access
              </a>
            </li>
            <li>
              <a href="#acceptable-use" className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors">
                3. Acceptable Use Policy
              </a>
            </li>
            <li>
              <a href="#fees-billing" className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors">
                4. Fees and Billing
              </a>
            </li>
            <li>
              <a href="#modifications" className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors">
                5. Modifications to Service
              </a>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-12">
          <section id="intro" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to Invoiceser ("Invoiceser," "we," "our," or "us"). We are thrilled that you have chosen our platform to streamline your freelance billing and get paid faster. These Terms of Service ("Terms") constitute a legally binding agreement governing your access to and use of the Invoiceser website, desktop and mobile applications, APIs, and related services (collectively, the "Service").
            </p>
            <p className="text-gray-600 leading-relaxed">
              By registering for an account, accessing the dashboard, or otherwise utilizing the Service, you acknowledge that you have read, understood, and unequivocally agree to be bound by these Terms. If you do not agree with any provision contained herein, you must immediately cease all use of the Service.
            </p>
          </section>

          <section id="user-accounts" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">2. User Accounts & Access</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To leverage the full capabilities of Invoiceser, you must complete the registration process by providing accurate, current, and complete information as prompted by the registration form.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li><strong>Account Security:</strong> You are solely and entirely responsible for maintaining the strict confidentiality of your account credentials (email and password). You agree to notify our security team immediately of any unauthorized access, suspected breach, or any other breach of security.</li>
              <li><strong>Eligibility:</strong> You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to create an Invoiceser account and utilize our billing infrastructure.</li>
              <li><strong>Account Suspension:</strong> We reserve the right to suspend or terminate your account—without prior notice or liability—if we determine, at our sole discretion, that you have violated these Terms or engaged in unauthorized or fraudulent activity.</li>
            </ul>
          </section>

          <section id="acceptable-use" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">3. Acceptable Use Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Invoiceser is designed to facilitate legitimate business transactions between freelancers, agencies, and their respective clients. You agree to use the Service strictly for lawful, ethical business purposes. You explicitly agree that you will NOT:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li>Use the platform to generate fraudulent invoices, engage in money laundering, phishing, or any form of financial deception.</li>
              <li>Upload or transmit viruses, trojans, malicious code, or attempt to compromise the integrity of our cloud infrastructure.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code or predictive AI models that power Invoiceser.</li>
              <li>Harass, abuse, or send unsolicited "spam" communications to clients via our automated reminder engine.</li>
            </ul>
          </section>

          <section id="fees-billing" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">4. Fees and Billing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              While our core invoicing functionality is offered free of charge, certain advanced features (e.g., custom domains, predictive analytics) require a paid Pro subscription.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li><strong>Subscription Cycles:</strong> Pro subscriptions are billed in advance on a recurring monthly or annual basis, depending on the plan you select at checkout.</li>
              <li><strong>Payment Processing:</strong> By subscribing, you authorize us (via our third-party payment processor) to automatically charge your payment method on file on the renewal date.</li>
              <li><strong>Refunds:</strong> Subscription fees are non-refundable, except as explicitly required by local law. You may cancel your subscription at any time to prevent future billing.</li>
            </ul>
          </section>

          <section id="modifications" className="scroll-mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">5. Modifications to Service</h2>
            <p className="text-gray-600 leading-relaxed">
              The tech landscape moves fast, and so do we. Invoiceser is constantly evolving to provide better tools for freelancers. We reserve the right to modify, update, suspend, or discontinue any aspect of the Service (including specific features or integrations) at any time, with or without prior notice.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Furthermore, we may revise these Terms of Service periodically to reflect changes in the law or our business practices. Your continued use of the platform following the posting of revised Terms constitutes your definitive acceptance of the modifications.
            </p>
          </section>
        </div>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
