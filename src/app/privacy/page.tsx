import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { PublicHeader } from "@/components/home/public-header";
import styles from "../(public)/landing.module.css";

const sections = [
  { id: "intro", title: "1. Introduction", paragraphs: [
    "At Invoiceser, transparency and trust are the cornerstones of our business. We recognize that as an independent professional or small business owner, you are entrusting us with sensitive financial data, client contact lists, and proprietary business metrics.",
    "This comprehensive Privacy Policy outlines exactly how we collect, process, safeguard, and share your personal and business information when you interact with our website, application, APIs, and related services (collectively referred to as \"Invoiceser\" or the \"Services\"). By using our platform, you consent to the practices described in this document.",
  ]},
  { id: "info-collection", title: "2. Information We Collect", paragraphs: ["To provide you with a world-class invoicing experience, we gather information in a few different ways. We only collect what is strictly necessary to deliver, improve, and secure our services."], items: [
    ["Account & Profile Data:", "When you register, we collect your name, email address, password (securely hashed), business name, and business address. This forms the basis of your Invoiceser identity."],
    ["Financial & Payment Data:", "While we do not store full credit card numbers directly on our servers (we utilize PCI-compliant partners like Stripe and PayPal), we do store transaction IDs, subscription status, and billing history to maintain your account."],
    ["Client Data:", "To generate and send invoices on your behalf, we store the names, emails, and addresses of the clients you input into our system. We act solely as a data processor for this information; it remains entirely yours."],
    ["Usage Metrics & Telemetry:", "We automatically collect diagnostic data such as IP addresses, browser types, interaction times, and feature usage patterns. This helps our engineering team identify bugs, optimize performance, and understand which features deliver the most value."],
  ]},
  { id: "info-usage", title: "3. How We Use Information", paragraphs: ["Your data is the fuel that powers the automation, insights, and reliability of Invoiceser. We leverage the information we collect for several critical business purposes:"], items: [
    ["Service Delivery:", "To generate accurate PDF invoices, execute automated email reminders, calculate tax liabilities, and render your real-time revenue analytics dashboards."],
    ["Platform Communication:", "To send you essential administrative notices, security alerts, billing confirmations, and carefully curated product updates (which you can opt out of at any time)."],
    ["Continuous Improvement:", "To power our predictive revenue models, train our AI assistant (using anonymized, aggregated data), and refine our user interface based on real-world usage trends."],
    ["Security & Compliance:", "To proactively detect and prevent fraudulent account creation, unauthorized access attempts, phishing campaigns, and to comply with global regulatory obligations."],
  ]},
  { id: "sharing", title: "4. Data Sharing & Disclosure", paragraphs: ["We never sell your personal data or your client lists to third-party data brokers. We only share information with trusted partners who are strictly vetted and legally bound to uphold stringent privacy standards. We may share data with:"], items: [
    ["Cloud Infrastructure Providers:", "Companies like Vercel and AWS that securely host our application and database environments."],
    ["Payment Processors:", "Gateways like Stripe that securely process your subscription fees and handle the end-to-end payment flow when your clients settle an invoice."],
    ["Communication Services:", "Email delivery networks that ensure your invoices and reminders reliably reach your clients' inboxes without being flagged as spam."],
  ]},
  { id: "security", title: "5. Data Security", paragraphs: [
    "Security is not an afterthought at Invoiceser—it is engineered directly into our architecture. We employ military-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our infrastructure undergoes regular automated vulnerability scanning and annual third-party penetration testing.",
    "However, it is crucial to remember that no electronic transmission over the internet or cloud storage solution is mathematically guaranteed to be 100% secure. You share responsibility for your data by maintaining strong, unique passwords and safeguarding your account credentials.",
  ]},
];

export default function PrivacyPage() {
  return <div className={styles.publicPage}><PublicHeader /><section className={styles.publicHero}><div className={styles.publicHeroInner}><p className={styles.eyebrow}>Legal</p><h1>Privacy Policy</h1><p>Last updated on the 1st of October 2026</p></div></section><main className={styles.documentMain}><aside className={styles.toc}><h2>Table of contents</h2><ul>{sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul></aside><div className={styles.documentContent}>{sections.map(section=><section key={section.id} id={section.id} className={styles.documentSection}><h2>{section.title}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.items?<ul>{section.items.map(([label,text])=><li key={label}><strong>{label}</strong> {text}</li>)}</ul>:null}{section.id==="security"?<p>If you have any questions, concerns, or wish to exercise your rights under GDPR or CCPA regarding your data, please contact our dedicated privacy team at <a href="mailto:privacy@invoiceser.com">privacy@invoiceser.com</a>.</p>:null}</section>)}</div></main><CTA /><Footer /></div>;
}
