import Link from 'next/link';
import { NavMenu } from '../navigation';
import styles from './header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href='/' className={styles.logo}>
          <span className={styles.logoText}>Cotap</span>
        </Link>

        <NavMenu />

        <div className={styles.actions}>
          <Link
            href='/cart'
            className={styles.cartLink}
            aria-label='Shopping cart'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='9' cy='21' r='1' />
              <circle cx='20' cy='21' r='1' />
              <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
