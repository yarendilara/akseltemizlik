"use client";

import { useEffect, useState } from 'react';
import { Lock, Clock, CheckCircle2, Settings, Shield, Plus, Trash2, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { getSiteSetting, updateSiteSetting } from '@/actions/settings';

export default function SettingsAdmin() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [budgets, setBudgets] = useState<string[]>(['2000-4000', '4000-7000']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const savedStartTime = await getSiteSetting('start_time');
      const savedEndTime = await getSiteSetting('end_time');
      const savedBudgets = await getSiteSetting('budget_options');
      
      if (savedStartTime) setStartTime(savedStartTime);
      if (savedEndTime) setEndTime(savedEndTime);
      if (savedBudgets) setBudgets(savedBudgets);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    await updateSiteSetting('start_time', startTime);
    await updateSiteSetting('end_time', endTime);
    await updateSiteSetting('budget_options', budgets);

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addBudget = () => {
    setBudgets([...budgets, '']);
  };

  const removeBudget = (index: number) => {
    setBudgets(budgets.filter((_, i) => i !== index));
  };

  const updateBudget = (index: number, val: string) => {
    const newBudgets = [...budgets];
    newBudgets[index] = val;
    setBudgets(newBudgets);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Settings size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1>Sistem Ayarları</h1>
        </div>
        <p>Platform parametrelerini ve bütçe aralıklarını buradan yönetin.</p>
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
        </div>
      </div>

      {/* Budget Options */}
      <div className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <DollarSign size={20} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Bütçe Aralığı Ayarları</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {budgets.map((budget, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={budget}
                  onChange={e => updateBudget(index, e.target.value)}
                  placeholder="Örn: 2000-4000"
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem 1rem', 
                    background: 'var(--bg-card)', 
                    border: '1.5px solid rgba(14,165,233,0.15)', 
                    color: 'var(--text-primary)', 
                    borderRadius: '10px' 
                  }} 
                />
                <button 
                  onClick={() => removeBudget(index)}
                  style={{ color: '#ef4444', padding: '0.5rem' }}
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button 
              onClick={addBudget}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--accent-blue)', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                marginTop: '0.5rem'
              }}
            >
              <Plus size={16} /> Yeni Aralık Ekle
            </button>
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
              {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
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
