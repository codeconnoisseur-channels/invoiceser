import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import styles from "../../app/(public)/landing.module.css";

export function PublicHeader() {
  return (
    <header className={styles.innerHeader}>
      <div className={styles.innerNav}>
        <Logo className={styles.brand} textClassName={styles.brandText} />
        <div className={styles.innerActions}>
          <Link href="/sign-in" className={styles.innerLogin}>Login</Link>
          <Link href="/sign-up" className={styles.navPrimary}>Get Started</Link>
        </div>
      </div>
    </header>
  );
}
