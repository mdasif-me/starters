'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './nav-menu.module.css';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={styles.mobileMenuContainer}>
      <button
        type='button'
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label='Toggle navigation menu'
        aria-expanded={isOpen}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={closeMenu}
            aria-hidden='true'
          />
          <nav className={styles.mobileNav} aria-label='Mobile navigation'>
            <ul className={styles.mobileNavList}>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
