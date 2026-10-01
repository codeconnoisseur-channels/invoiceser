import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "../../app/(public)/landing.module.css";

export function CTA() {
  return <section className={styles.ctaSection} aria-labelledby="cta-heading"><div className={styles.ctaCard}><div><p className={styles.eyebrow}>Start today</p><h2 id="cta-heading">Ready to get paid on time?</h2><p>Join thousands of freelancers who use Invoiceser to take the stress out of billing and get back to their real work.</p></div><div className={styles.ctaActions}><Link href="/sign-up" className={styles.primaryButton}>Create your free account <ArrowRight aria-hidden="true" /></Link></div></div></section>;
}
