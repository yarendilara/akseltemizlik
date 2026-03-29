"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/app/layout.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <a href="/" className={styles.logo}>
          AKSEL<span className={styles.logoHighlight}>TEMİZLİK</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}></span>
        </button>

        {/* Links */}
        <div className={`${styles.navLinks} ${isOpen ? styles.navLinksOpen : ''}`}>
          <a href="/hakkimizda" onClick={() => setIsOpen(false)}>Hakkımızda</a>
          <a href="/randevularim" onClick={() => setIsOpen(false)}>Randevularım</a>
          <a href="/hizmet-veren-ol" onClick={() => setIsOpen(false)}>Hizmet Veren Ol</a>
        </div>

        {/* CTA Actions */}
        <div className={styles.navActions}>
          <motion.a
            href="/giris"
            className="btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Giriş Yap
          </motion.a>
          <motion.a
            href="/rezervasyon"
            className="btn-solid"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Randevu Al
          </motion.a>
        </div>
      </div>
    </nav>
  );
}
