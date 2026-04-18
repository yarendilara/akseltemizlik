"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Camera, MessageCircle, ChevronDown } from 'lucide-react';
import styles from '@/app/layout.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.headerWrapper} ${scrolled ? styles.headerScrolled : ''}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContainer}`}>
          <div className={styles.topLinks}>
            <a href="tel:+905465959280" className={styles.topItem}>
              <Phone size={14} />
              <span>+90 546 595 92 80</span>
            </a>
            <a href="mailto:destek@zindetemizlik.com" className={styles.topItem}>
              <Mail size={14} />
              <span>destek@zindetemizlik.com</span>
            </a>
          </div>
          <div className={styles.topSocials}>
            <a href="https://instagram.com/zindetemizlik" target="_blank" rel="noopener noreferrer" className={styles.topItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://wa.me/905465959280" target="_blank" rel="noopener noreferrer" className={styles.topItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={`container ${styles.navContainer}`}>
          <a href="/" className={styles.logo}>
            ZİNDE<span className={styles.logoHighlight}>TEMİZLİK</span>
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
        </div>

        {/* CTA Actions */}
        <div className={styles.navActions}>
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
    </header>
  );
}
