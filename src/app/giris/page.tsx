"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, User2, ArrowLeft } from 'lucide-react';
import { cleanerLogin } from '@/lib/mock-db';
import styles from './page.module.css';

type Mode = 'calisan' | 'admin';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('calisan');

  // Çalışan
  const [email, setEmail] = useState('');
  const [cleanerPw, setCleanerPw] = useState('');
  const [cleanerErr, setCleanerErr] = useState('');
  const [cleanerLoading, setCleanerLoading] = useState(false);

  // Admin
  const [adminPw, setAdminPw] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const router = useRouter();

  const handleCleanerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCleanerLoading(true);
    setCleanerErr('');
    setTimeout(() => {
      const user = cleanerLogin(email, cleanerPw);
      if (user) {
        router.push('/temizlikci');
      } else {
        setCleanerErr('E-posta adresi veya şifre hatalı.');
      }
      setCleanerLoading(false);
    }, 800);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPw }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setAdminErr(data.error || 'Giriş başarısız.');
      }
    } catch {
      setAdminErr('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Background decoration */}
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <a href="/" className={styles.logo}>
          AKSEL<span className={styles.logoOrange}>TEMİZLİK</span>
        </a>

        <p className={styles.tagline}>Operasyon Paneli</p>

        {/* Slide Toggle */}
        <div className={styles.toggle}>
          <motion.div
            className={styles.toggleSlider}
            animate={{ x: mode === 'admin' ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
          <button
            className={`${styles.toggleBtn} ${mode === 'calisan' ? styles.toggleActive : ''}`}
            onClick={() => setMode('calisan')}
          >
            <User2 size={15} />
            Çalışan Girişi
          </button>
          <button
            className={`${styles.toggleBtn} ${mode === 'admin' ? styles.toggleActive : ''}`}
            onClick={() => setMode('admin')}
          >
            <ShieldCheck size={15} />
            Admin Girişi
          </button>
        </div>

        {/* Forms with slide animation */}
        <div className={styles.formArea}>
          <AnimatePresence mode="wait">
            {mode === 'calisan' ? (
              <motion.form
                key="calisan"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleCleanerLogin}
                className={styles.form}
              >
                <p className={styles.formDesc}>
                  Aksel operasyon paneline erişmek için bilgilerinizi girin.
                </p>

                {cleanerErr && <div className={styles.errorBox}>{cleanerErr}</div>}

                <div className={styles.inputGroup}>
                  <label>E-Posta Adresi</label>
                  <div className={styles.inputRow}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="ornek@aksel.test"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Şifre</label>
                  <div className={styles.inputRow}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={cleanerPw}
                      onChange={e => setCleanerPw(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={`btn-solid ${styles.submitBtn}`} disabled={cleanerLoading}>
                  {cleanerLoading ? 'Giriş Yapılıyor…' : 'Sisteme Giriş Yap'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="admin"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleAdminLogin}
                className={styles.form}
              >
                <p className={styles.formDesc}>
                  Operasyon merkezine erişmek için yönetici parolasını giriniz.
                </p>

                {adminErr && <div className={styles.errorBox}>{adminErr}</div>}

                <div className={styles.inputGroup}>
                  <label>Yönetici Parolası</label>
                  <div className={styles.inputRow}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={adminPw}
                      onChange={e => setAdminPw(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={`btn-solid ${styles.submitBtn}`} disabled={adminLoading}>
                  {adminLoading ? 'Doğrulanıyor…' : 'Güvenli Giriş Yap'}
                </button>

                <p className={styles.secureNote}>
                  🔒 Sadece yetkili personel. Tüm erişimler kayıt altına alınmaktadır.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <a href="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </a>
      </motion.div>
    </div>
  );
}
