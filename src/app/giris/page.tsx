"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const [adminPw, setAdminPw] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

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

        <p className={styles.tagline}>Yönetim Paneli</p>

        <div className={styles.adminIconWrapper}>
            <ShieldCheck size={48} className={styles.adminIcon} />
        </div>

        {/* Forms */}
        <div className={styles.formArea}>
          <form
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
          </form>
        </div>

        <a href="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </a>
      </motion.div>
    </div>
  );
}
