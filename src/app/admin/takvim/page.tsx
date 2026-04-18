"use client";

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Briefcase, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { getBookings } from '@/lib/mock-db';

export default function CalendarAdmin() {
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [dates, setDates] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const resp = await fetch('/api/bookings');
        const data = await resp.json();
        
        if (Array.isArray(data)) {
          setTotalJobs(data.length);
          
          const grouped: any = {};
          data.forEach((b: any) => {
             const d = (b.startAt ? new Date(b.startAt).toLocaleDateString('tr-TR') : b.date) || 'Bilinmeyen Tarih';
             if (!grouped[d]) grouped[d] = { date: d, jobs: 0, slots: 15, status: "Normal" };
             grouped[d].jobs += 1;
             grouped[d].slots -= 1;
             if (grouped[d].slots < 5) grouped[d].status = "Kritik";
             if (grouped[d].slots <= 0) grouped[d].status = "Bloke";
          });
          
          let datesArr = Object.values(grouped);
          if (datesArr.length === 0) {
            datesArr = [
               { date: "Bugün", jobs: 0, slots: 15, status: "Sakin" },
               { date: "Yarın", jobs: 0, slots: 15, status: "Sakin" }
            ];
          }
          setDates(datesArr);
        }
      } catch (err) {
        console.error("Calendar load error:", err);
      }
    }
    loadCalendar();
  }, []);

  const handleDayDetail = (date: string) => {
    setLoadingDate(date);
    setTimeout(() => {
      alert(date + " günü detayları yükleniyor...");
      setLoadingDate(null);
    }, 600);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Kritik': return <AlertCircle size={14} />;
      case 'Bloke': return <XCircle size={14} />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <CalendarIcon size={24} className={styles.accentIcon} />
          <h1>Operasyon Takvimi</h1>
        </div>
        <p>Günlük iş dağılımı ve kapasite doluluk oranlarını buradan izleyebilirsiniz.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Sistemdeki Toplam İş</span>
            <Briefcase size={16} style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.statValue}>{totalJobs}</div>
          <span className={styles.statTrend}>Tüm zamanlar</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Bloklanan Günler</span>
            <XCircle size={16} style={{ opacity: 0.5, color: 'var(--error)' }} />
          </div>
          <div className={styles.statValue}>{dates.filter(d => d.status === 'Bloke').length}</div>
          <span className={styles.statTrend} style={{ color: 'var(--error)' }}>Kapasite Fazlası</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Müsaitlik Oranı (Genel)</span>
            <Clock size={16} style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.statValue}>İyi</div>
          <span className={styles.statTrend}>Müsait Kapasite Var</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Aktif Günler: Doluluk & Kapasite</h3>
          <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Manuel bloklama ekranı açılıyor...")}>
            <Plus size={16} /> Yeni Manuel Blok
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {dates.map((d: any) => (
            <div key={d.date} style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: '16px', 
              border: '1.5px solid rgba(14, 165, 233, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
            }}
            >
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>{d.date}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>İş Adedi:</span>
                <strong style={{ color: 'var(--primary)' }}>{d.jobs}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Müsait Kapasite:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{d.slots}</strong>
              </div>
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.6rem',
                textAlign: 'center',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                background: d.status === 'Kritik' ? 'rgba(231, 76, 60, 0.1)' : 
                            d.status === 'Bloke' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: d.status === 'Kritik' ? '#e74c3c' : 
                       d.status === 'Bloke' ? '#64748b' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {getStatusIcon(d.status)}
                {d.status}
              </div>
              <button 
                className={styles.actionBtn} 
                style={{ marginTop: '0.8rem', background: 'var(--primary-xlight)', padding: '0.8rem', borderRadius: '10px' }}
                onClick={() => handleDayDetail(d.date)}
                disabled={loadingDate === d.date}
              >
                {loadingDate === d.date ? "Yükleniyor..." : "İşleri Yönet"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
