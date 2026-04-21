"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/layout.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Audio setup
  useEffect(() => {
    const audio = new Audio('/music/Zinde Temizlik_ Tertemiz Hayat.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Video detection — pause music when any video plays
    const handleVideoPlay = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    const handleVideoPause = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('pause', handleVideoPause, true);
    document.addEventListener('ended', handleVideoPause, true);

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('pause', handleVideoPause, true);
      document.removeEventListener('ended', handleVideoPause, true);
    };
  }, []);

  // Sync play state
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Check if any video is currently playing
    const videos = document.querySelectorAll('video');
    let videoPlaying = false;
    videos.forEach(v => { if (!v.paused) videoPlaying = true; });

    if (isPlaying && !videoPlaying) {
      audioRef.current.play().catch(() => {});
    } else if (!isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

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
          <Link href="/" className={styles.logo}>
            ZİNDE<span className={styles.logoHighlight}>TEMİZLİK</span>
          </Link>

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
          <a href="/calisan-basvurusu" onClick={() => setIsOpen(false)}>Çalışan Başvurusu</a>
        </div>

        {/* CTA Actions */}
        <div className={styles.navActions}>
          {/* Music Toggle Button */}
          <button
            onClick={toggleMusic}
            aria-label={isPlaying ? "Müziği Kapat" : "Müziği Aç"}
            title={isPlaying ? "Müziği Kapat" : "Müziği Aç"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: isPlaying ? '2px solid #0EA5E9' : '2px solid rgba(14,165,233,0.3)',
              background: isPlaying ? 'rgba(14,165,233,0.1)' : 'transparent',
              color: isPlaying ? '#0EA5E9' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {isPlaying && (
              <span style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid #0EA5E9',
                animation: 'musicPulse 1.5s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            )}
          </button>

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

    {/* Music pulse animation */}
    <style jsx global>{`
      @keyframes musicPulse {
        0% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.4); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    `}</style>
    </header>
  );
}
