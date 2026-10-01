import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { PublicHeader } from "@/components/home/public-header";
import styles from "../(public)/landing.module.css";

const sections = [
  { id: "intro", title: "1. Introduction", paragraphs: [
    "Welcome to Invoiceser (\"Invoiceser,\" \"we,\" \"our,\" or \"us\"). We are thrilled that you have chosen our platform to streamline your freelance billing and get paid faster. These Terms of Service (\"Terms\") constitute a legally binding agreement governing your access to and use of the Invoiceser website, desktop and mobile applications, APIs, and related services (collectively, the \"Service\").",
    "By registering for an account, accessing the dashboard, or otherwise utilizing the Service, you acknowledge that you have read, understood, and unequivocally agree to be bound by these Terms. If you do not agree with any provision contained herein, you must immediately cease all use of the Service.",
  ]},
  { id: "user-accounts", title: "2. User Accounts & Access", paragraphs: ["To leverage the full capabilities of Invoiceser, you must complete the registration process by providing accurate, current, and complete information as prompted by the registration form."], items: [
    ["Account Security:", "You are solely and entirely responsible for maintaining the strict confidentiality of your account credentials (email and password). You agree to notify our security team immediately of any unauthorized access, suspected breach, or any other breach of security."],
    ["Eligibility:", "You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to create an Invoiceser account and utilize our billing infrastructure."],
    ["Account Suspension:", "We reserve the right to suspend or terminate your account—without prior notice or liability—if we determine, at our sole discretion, that you have violated these Terms or engaged in unauthorized or fraudulent activity."],
  ]},
  { id: "acceptable-use", title: "3. Acceptable Use Policy", paragraphs: ["Invoiceser is designed to facilitate legitimate business transactions between freelancers, agencies, and their respective clients. You agree to use the Service strictly for lawful, ethical business purposes. You explicitly agree that you will NOT:"], plainItems: [
    "Use the platform to generate fraudulent invoices, engage in money laundering, phishing, or any form of financial deception.",
    "Upload or transmit viruses, trojans, malicious code, or attempt to compromise the integrity of our cloud infrastructure.",
    "Reverse engineer, decompile, or attempt to extract the source code or predictive AI models that power Invoiceser.",
    "Harass, abuse, or send unsolicited \"spam\" communications to clients via our automated reminder engine.",
  ]},
  { id: "fees-billing", title: "4. Fees and Billing", paragraphs: ["While our core invoicing functionality is offered free of charge, certain advanced features (e.g., custom domains, predictive analytics) require a paid Pro subscription."], items: [
    ["Subscription Cycles:", "Pro subscriptions are billed in advance on a recurring monthly or annual basis, depending on the plan you select at checkout."],
    ["Payment Processing:", "By subscribing, you authorize us (via our third-party payment processor) to automatically charge your payment method on file on the renewal date."],
    ["Refunds:", "Subscription fees are non-refundable, except as explicitly required by local law. You may cancel your subscription at any time to prevent future billing."],
  ]},
  { id: "modifications", title: "5. Modifications to Service", paragraphs: [
    "The tech landscape moves fast, and so do we. Invoiceser is constantly evolving to provide better tools for freelancers. We reserve the right to modify, update, suspend, or discontinue any aspect of the Service (including specific features or integrations) at any time, with or without prior notice.",
    "Furthermore, we may revise these Terms of Service periodically to reflect changes in the law or our business practices. Your continued use of the platform following the posting of revised Terms constitutes your definitive acceptance of the modifications.",
  ]},
];

export default function TermsPage() {
  return <div className={styles.publicPage}><PublicHeader /><section className={styles.publicHero}><div className={styles.publicHeroInner}><p className={styles.eyebrow}>Legal</p><h1>Terms of Service</h1><p>Last updated on the 27th of June 2026</p></div></section><main className={styles.documentMain}><aside className={styles.toc}><h2>Table of contents</h2><ul>{sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul></aside><div className={styles.documentContent}>{sections.map(section=><section key={section.id} id={section.id} className={styles.documentSection}><h2>{section.title}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.items?<ul>{section.items.map(([label,text])=><li key={label}><strong>{label}</strong> {text}</li>)}</ul>:null}{section.plainItems?<ul>{section.plainItems.map(item=><li key={item}>{item}</li>)}</ul>:null}</section>)}</div></main><CTA /><Footer /></div>;
}
