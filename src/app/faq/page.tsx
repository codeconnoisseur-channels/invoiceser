"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, Plus, Minus } from "lucide-react";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";

const faqs = [
  {
    question: "Is Invoiceser really free to use?",
    answer: "Absolutely. We believe that independent professionals should have access to essential billing tools without restrictive paywalls. Our Free tier provides you with unlimited invoicing, unlimited clients, and full access to our core invoice generation engine. We only charge for our advanced AI insights, customized domain setups, and predictive revenue tools available in the Pro plan."
  },
  {
    question: "How quickly can I get paid?",
    answer: "Getting paid faster is the primary reason we built Invoiceser. By connecting your preferred payment gateway—such as Stripe, PayPal, or Square—your clients can securely pay you instantly via credit card or bank transfer directly from the invoice link. On average, our users see their invoices settled 30% faster than traditional PDF attachments."
  },
  {
    question: "Can I bill international clients in different currencies?",
    answer: "Yes, you can confidently take your business global. Invoiceser supports billing in over 15 major global currencies including USD, GBP, EUR, CAD, AUD, and JPY. We also provide built-in tax support to help you manage local sales taxes, VAT, and GST seamlessly on a per-invoice basis."
  },
  {
    question: "How do the automatic payment reminders work?",
    answer: "Chasing payments is a thing of the past. When you enable automatic reminders, Invoiceser acts as your personal accounts receivable assistant. It will automatically dispatch polite, professionally-worded follow-up emails to your clients 3 days before the due date, on the actual due date, and every 5 days once the invoice becomes overdue."
  },
  {
    question: "Can I customize my invoices to match my brand?",
    answer: "Your invoices are a direct extension of your brand identity. Invoiceser allows you to upload your company logo, define your exact brand hex codes for accents, and select from a range of premium, curated fonts (such as Modern, Classic, or Typewriter) to ensure your bills look as professional as your work."
  },
  {
    question: "What happens if I need to cancel my Pro subscription?",
    answer: "We offer complete flexibility. You can upgrade, downgrade, or cancel your Pro subscription at any time directly from your billing dashboard. If you downgrade, you will retain access to all your past invoices and client data, and simply seamlessly transition back to our robust Free plan at the end of your billing cycle."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      <section className="bg-primary-50/50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Frequently asked questions</h1>
          <p className="text-lg text-gray-600 font-medium">Everything you need to know about billing, features, and managing your freelance business with Invoiceser.</p>
        </div>
      </section>
      
      {/* Accordion Content */}
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-gray-200 last:border-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
                >
                  <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{faq.question}</span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 pb-6" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
