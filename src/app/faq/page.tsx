"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { PublicHeader } from "@/components/home/public-header";
import styles from "../(public)/landing.module.css";

const faqs = [
  { question: "Is Invoiceser really free to use?", answer: "Absolutely. We believe that independent professionals should have access to essential billing tools without restrictive paywalls. Our Free tier provides you with unlimited invoicing, unlimited clients, and full access to our core invoice generation engine. We only charge for our advanced AI insights, customized domain setups, and predictive revenue tools available in the Pro plan." },
  { question: "How quickly can I get paid?", answer: "Getting paid faster is the primary reason we built Invoiceser. By connecting your preferred payment gateway—such as Stripe, PayPal, or Square—your clients can securely pay you instantly via credit card or bank transfer directly from the invoice link. On average, our users see their invoices settled 30% faster than traditional PDF attachments." },
  { question: "Can I bill international clients in different currencies?", answer: "Yes, you can confidently take your business global. Invoiceser supports billing in over 15 major global currencies including USD, GBP, EUR, CAD, AUD, and JPY. We also provide built-in tax support to help you manage local sales taxes, VAT, and GST seamlessly on a per-invoice basis." },
  { question: "How do the automatic payment reminders work?", answer: "Chasing payments is a thing of the past. When you enable automatic reminders, Invoiceser acts as your personal accounts receivable assistant. It will automatically dispatch polite, professionally-worded follow-up emails to your clients 3 days before the due date, on the actual due date, and every 5 days once the invoice becomes overdue." },
  { question: "Can I customize my invoices to match my brand?", answer: "Your invoices are a direct extension of your brand identity. Invoiceser allows you to upload your company logo, define your exact brand hex codes for accents, and select from a range of premium, curated fonts (such as Modern, Classic, or Typewriter) to ensure your bills look as professional as your work." },
  { question: "What happens if I need to cancel my Pro subscription?", answer: "We offer complete flexibility. You can upgrade, downgrade, or cancel your Pro subscription at any time directly from your billing dashboard. If you downgrade, you will retain access to all your past invoices and client data, and simply seamlessly transition back to our robust Free plan at the end of your billing cycle." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className={styles.publicPage}>
      <PublicHeader />
      <section className={styles.publicHero}><div className={styles.publicHeroInner}><p className={styles.eyebrow}>Help centre</p><h1>Frequently asked questions</h1><p>Everything you need to know about billing, features, and managing your freelance business with Invoiceser.</p></div></section>
      <main className={styles.faqMain}><div className={styles.faqList}>{faqs.map((faq,index)=>{const isOpen=openIndex===index;const panelId=`faq-answer-${index}`;return <div key={faq.question} className={styles.faqItem}><button type="button" className={styles.faqButton} aria-expanded={isOpen} aria-controls={panelId} onClick={()=>setOpenIndex(isOpen?null:index)}><span>{faq.question}</span>{isOpen?<Minus aria-hidden="true"/>:<Plus aria-hidden="true"/>}</button><div id={panelId} className={`${styles.faqAnswer} ${isOpen?styles.faqAnswerOpen:styles.faqAnswerClosed}`}><p>{faq.answer}</p></div></div>})}</div></main>
      <CTA />
      <Footer />
    </div>
  );
}
