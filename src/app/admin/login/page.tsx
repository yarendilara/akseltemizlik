"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>AKSEL<span>ADMIN</span></div>
          <h1>Operasyon Merkezi Girişi</h1>
          <p>Devam etmek için yönetici parolanızı giriniz.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Yönetici Parolası</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className="btn-solid" disabled={isLoading}>
            {isLoading ? "Doğrulanıyor..." : "Güvenli Giriş Yap"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>🔒 Bu alan sadece yetkili personel içindir. Tüm erişimler loglanmaktadır.</p>
        </div>
      </div>
    </div>
  );
}
