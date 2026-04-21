"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { submitJobApplication } from "@/actions/jobApplication";

export default function JobApplicationPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      residence: formData.get("residence") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || undefined,
      birthDate: new Date(formData.get("birthDate") as string),
      experience: formData.get("experience") as string,
    };

    const result = await submitJobApplication(data);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Başvurunuz Alındı!</h2>
            <p>
              Aksel Temizlik ailesine katılmak için yaptığınız başvuru başarıyla tarafımıza ulaştı. 
              Ekibimiz başvurunuzu inceledikten sonra sizinle iletişime geçecektir.
            </p>
            <button 
              className={styles.btnSubmit} 
              style={{ marginTop: '2rem' }}
              onClick={() => window.location.href = '/'}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Ekibimize Katılın</h1>
          <p>Aksel Temizlik ailesinin bir parçası olmak için aşağıdaki formu doldurmanız yeterli.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Ad Soyad</label>
            <input type="text" id="fullName" name="fullName" required placeholder="Örn: Ahmet Yılmaz" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefon Numarası</label>
            <input type="tel" id="phone" name="phone" required placeholder="05xx xxx xx xx" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta (Opsiyonel)</label>
            <input type="email" id="email" name="email" placeholder="ornek@mail.com" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthDate">Doğum Tarihi</label>
            <input type="date" id="birthDate" name="birthDate" required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="residence">İkametgah (Nerede yaşıyorsunuz?)</label>
            <input type="text" id="residence" name="residence" required placeholder="İlçe, Mahalle..." />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="experience">İş Deneyimi</label>
            <textarea 
              id="experience" 
              name="experience" 
              rows={4} 
              required 
              placeholder="Daha önce hangi temizlik işlerinde çalıştınız? Kaç yıl deneyiminiz var?"
            ></textarea>
          </div>

          {error && <p style={{ color: 'var(--error)', gridColumn: '1/-1', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? "Başvurunuz Gönderiliyor..." : "Başvuruyu Tamamla"}
          </button>
        </form>
      </div>
    </div>
  );
}
