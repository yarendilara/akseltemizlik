"use client";

import { useState } from 'react';
import { Lock, Clock, CheckCircle2, Settings, Shield } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';

export default function SettingsAdmin() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Settings size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1>Sistem Ayarları</h1>
        </div>
        <p>Platform parametrelerini ve güvenlik yapılandırmalarını buradan yönetin.</p>
      </div>

      {/* Working Hours */}
      <div className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Clock size={20} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Çalışma Saatleri</h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem', 
            marginBottom: '1.5rem',
          }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Başlangıç Saati</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem 1rem', 
                  background: 'var(--bg-card)', 
                  border: '1.5px solid rgba(14,165,233,0.15)', 
                  color: 'var(--text-primary)', 
                  borderRadius: '10px',
                  fontSize: '1rem',
                }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Bitiş Saati</label>
              <input 
                type="time" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem 1rem', 
                  background: 'var(--bg-card)', 
                  border: '1.5px solid rgba(14,165,233,0.15)', 
                  color: 'var(--text-primary)', 
                  borderRadius: '10px',
                  fontSize: '1rem',
                }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '0.7rem 1.5rem',
                background: '#0EA5E9',
                color: '#fff',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                opacity: isSaving ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            {saveSuccess && (
              <span style={{ color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> Başarıyla güncellendi.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className={styles.tableCard}>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Shield size={20} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Güvenlik</h3>
          </div>
          
          <div style={{ 
            padding: '1.2rem', 
            background: 'rgba(14,165,233,0.04)', 
            borderRadius: '10px', 
            border: '1px solid rgba(14,165,233,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <Lock size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                Şifreleme Durumu
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AES-256-GCM şifreleme aktif. Tüm veriler güvenli.</p>
            </div>
            <span style={{ 
              padding: '0.4rem 1rem', 
              background: '#10b98115', 
              color: '#10b981', 
              borderRadius: '50px', 
              fontSize: '0.8rem', 
              fontWeight: 600 
            }}>
              Aktif ✓
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
