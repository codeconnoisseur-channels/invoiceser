import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import styles from "../../app/(public)/landing.module.css";

const groups = [
  { title: "Product", links: [{ label: "Features", href: "/#features" }, { label: "How It Works", href: "/#how-it-works" }, { label: "Pricing", href: "/#pricing" }, { label: "Dashboard", href: "/dashboard" }, { label: "FAQ", href: "/faq" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }] },
];

export function Footer() {
  return <footer className={styles.footer}><div className={styles.footerGrid}><div className={styles.footerBrand}><Logo className={styles.brand} textClassName={styles.brandText} /><p>Professional invoicing for freelancers and small teams who want to get paid faster.</p><div className={styles.socialLinks}>{[{ icon: Twitter, href: "https://twitter.com", label: "Follow us on Twitter" }, { icon: Linkedin, href: "https://linkedin.com", label: "Follow us on LinkedIn" }, { icon: Instagram, href: "https://instagram.com", label: "Follow us on Instagram" }].map(({ icon: Icon, href, label }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon aria-hidden="true" /></a>)}</div></div>{groups.map((group)=><div key={group.title} className={styles.footerGroup}><h3>{group.title}</h3><ul role="list">{group.links.map((link)=><li key={link.label}><Link href={link.href}>{link.label}</Link></li>)}</ul></div>)}</div><div className={styles.footerBottom}><p>© {new Date().getFullYear()} Invoiceser. All rights reserved.</p></div></footer>;
}
