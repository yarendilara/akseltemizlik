"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cleanerLogin } from '@/lib/mock-db';
import styles from './login.module.css';

export default function CleanerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = cleanerLogin(email, password);
      if (user) {
        router.push('/temizlikci');
      } else {
        setError('E-posta adresi veya şifre hatalı. Lütfen kontrol edin.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
            <div className={styles.logoCircle}>
                <ShieldCheck size={32} color="var(--accent-blue)" />
            </div>
            <h1>Çalışan Girişi</h1>
            <p>Aksel Temizlik operasyon paneline erişmek için bilgilerinizi girin.</p>
        </div>

        {error && (
            <div className={styles.errorBadge}>
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
                <label>E-Posta Adresi</label>
                <div className={styles.inputWrapper}>
                    <Mail size={18} className={styles.icon} />
                    <input 
                        type="email" 
                        placeholder="ornek@aksel.test" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>Şifre</label>
                <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.icon} />
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? "Giriş Yapılıyor..." : "Sisteme Giriş Yap"}
            </button>
        </form>

        <div className={styles.footer}>
            <button onClick={() => router.push('/')} className={styles.backBtn}>
                <ArrowLeft size={16} /> Ana Sayfaya Dön
            </button>
        </div>
      </div>
    </div>
  );
}
