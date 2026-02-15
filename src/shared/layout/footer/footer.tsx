import Link from 'next/link';
import styles from './footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Cotap</h3>
            <p className={styles.description}>
              Modern attendance management system for seamless workforce
              tracking.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Product</h3>
            <nav className={styles.links}>
              <Link href='/products' className={styles.link}>
                Products
              </Link>
              <Link href='/features' className={styles.link}>
                Features
              </Link>
              <Link href='/pricing' className={styles.link}>
                Pricing
              </Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Company</h3>
            <nav className={styles.links}>
              <Link href='/about' className={styles.link}>
                About
              </Link>
              <Link href='/contact' className={styles.link}>
                Contact
              </Link>
              <Link href='/careers' className={styles.link}>
                Careers
              </Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Legal</h3>
            <nav className={styles.links}>
              <Link href='/privacy' className={styles.link}>
                Privacy Policy
              </Link>
              <Link href='/terms' className={styles.link}>
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Cotap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
