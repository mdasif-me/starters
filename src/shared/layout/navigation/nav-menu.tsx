'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './mobile-menu';
import styles from './nav-menu.module.css';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
];

export function NavMenu() {
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.nav} aria-label='Main navigation'>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <MobileMenu items={navItems} />
    </>
  );
}
