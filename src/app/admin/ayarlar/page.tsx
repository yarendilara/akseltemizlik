"use client";

import { useState } from 'react';
import { Lock, Clock, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';

export default function SettingsAdmin() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Sistem Ayarları</h1>
        <p>Aksel platformu global parametrelerini ve güvenlik yapılandırmalarını buradan yönetin.</p>
      </div>

      <div className={styles.tableCard}>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Lock size={20} className={styles.accentIcon} />
              <h4 style={{ color: 'var(--white)' }}>Güvenlik ve Şifreleme</h4>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(2, 12, 27, 0.4)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ana Şifreleme Anahtarı (AES-256-GCM)</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mevcut anahtar geçerlidir ve HSM modülünde saklanmaktadır.</p>
              </div>
              <button className={styles.actionBtn} onClick={() => alert("Anahtar rotasyonu operasyonel onay gerektirir.")}>Rotasyon Yap</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Clock size={20} className={styles.accentIcon} />
              <h4 style={{ color: 'var(--white)' }}>Operasyonel Çalışma Saatleri</h4>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(2, 12, 27, 0.4)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Genel Başlangıç Saati</span>
                  <input type="time" defaultValue="09:00" style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem', background: '#020C1B', border: '1px solid #112240', color: 'var(--white)', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Genel Bitiş Saati</span>
                  <input type="time" defaultValue="18:00" style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem', background: '#020C1B', border: '1px solid #112240', color: 'var(--white)', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button 
                  className={styles.actionBtn} 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Kaydediliyor..." : "Evi-Plan Güncelle"}
                </button>
                {saveSuccess && (
                  <span style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> Başarıyla güncellendi.
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
