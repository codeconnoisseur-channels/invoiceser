import Image from "next/image";
import { BarChart3, CheckCircle2, Clock3, FileText, LayoutDashboard, Plus, Sparkles, Users } from "lucide-react";
import styles from "../../app/(public)/landing.module.css";

const invoices = [
  { client: "Northstar Studio", number: "INV-1048", amount: "$2,450.00", status: "Paid" },
  { client: "Field & Form", number: "INV-1047", amount: "$1,280.00", status: "Sent" },
  { client: "Morrow Labs", number: "INV-1046", amount: "$3,100.00", status: "Overdue" },
];

export function DashboardPreview() {
  return (
    <div className={styles.previewApp} aria-label="Fictional Invoiceser dashboard example">
      <aside className={styles.previewSidebar}>
        <div className={styles.previewBrand}><Image src="/invoiceser-logo.png" alt="" width={26} height={26} /><strong>Invoiceser</strong></div>
        <nav aria-label="Dashboard preview navigation">
          <span className={styles.previewActive}><LayoutDashboard />Dashboard</span>
          <span><Users />Clients</span>
          <span><FileText />Invoices</span>
          <span><BarChart3 />Analytics</span>
          <span className={styles.previewAi}><Sparkles />AI Assistant<strong>AI</strong></span>
        </nav>
      </aside>
      <div className={styles.previewMain}>
        <header className={styles.previewHeader}><div><p>Thursday, 1 October 2026</p><h2>Good morning, Morgan</h2></div><button type="button"><Plus />New invoice</button></header>
        <section className={styles.previewStats} aria-label="Invoice totals">
          <article><div className={styles.previewStatHeading}><p>Total invoices</p><span><FileText /></span></div><strong>28</strong><small>sent, pending & paid</small></article>
          <article><div className={styles.previewStatHeading}><p>Awaiting payment</p><span><Clock3 /></span></div><strong>$4,380</strong><small>3 invoices outstanding</small></article>
          <article><div className={styles.previewStatHeading}><p>Total collected</p><span><CheckCircle2 /></span></div><strong>$18,920</strong><small>all paid invoices</small></article>
        </section>
        <div className={styles.previewGrid}>
          <section className={styles.previewChart}><div><p>Revenue overview</p><strong>$23,300</strong></div><div className={styles.previewBars} aria-hidden="true">{[44,68,54,82,72,94,78,88].map((height,index)=><span key={index} style={{height:`${height}%`}} />)}</div><div className={styles.previewMonths}><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></section>
          <section className={styles.previewActivity}><div className={styles.previewSectionTitle}><p>Recent invoices</p><span>View all</span></div>{invoices.map((invoice)=><article key={invoice.number}><span className={styles.previewInitial}>{invoice.client.charAt(0)}</span><div><strong>{invoice.client}</strong><p>{invoice.number}</p></div><div><strong>{invoice.amount}</strong><span data-status={invoice.status.toLowerCase()}>{invoice.status}</span></div></article>)}</section>
        </div>
      </div>
    </div>
  );
}
