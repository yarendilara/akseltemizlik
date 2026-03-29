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
    const bookings = getBookings();
    setTotalJobs(bookings.length);
    
    // Group bookings by date (simple string match for now)
    const grouped: any = {};
    bookings.forEach((b: any) => {
       const d = b.date.split(' ')[0]; // Extract just the date part
       if (!grouped[d]) grouped[d] = { date: d, jobs: 0, slots: 15, status: "Normal" };
       grouped[d].jobs += 1;
       grouped[d].slots -= 1;
       if (grouped[d].slots < 5) grouped[d].status = "Kritik";
       if (grouped[d].slots <= 0) grouped[d].status = "Bloke";
    });
    
    // Convert to array and handle empty state by providing some defaults if no bookings exist
    let datesArr = Object.values(grouped);
    if (datesArr.length === 0) {
      datesArr = [
         { date: "Bugün", jobs: 0, slots: 15, status: "Sakin" },
         { date: "Yarın", jobs: 0, slots: 15, status: "Sakin" }
      ];
    }
    
    setDates(datesArr);
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
          <h3>Aktif Günler: Doluluk & Atama</h3>
          <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Manuel bloklama ekranı açılıyor...")}>
            <Plus size={16} /> Yeni Manuel Blok
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {dates.map((d: any) => (
            <div key={d.date} style={{ 
              background: 'rgba(17, 34, 64, 0.5)', 
              padding: '2rem', 
              borderRadius: '12px', 
              border: '1px solid rgba(100, 255, 218, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'rgba(100, 255, 218, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(100, 255, 218, 0.05)';
            }}
            >
              <h4 style={{ color: 'var(--white)', fontSize: '1rem' }}>{d.date}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>İş:</span>
                <strong style={{ color: 'var(--accent-blue)' }}>{d.jobs}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Müsait Slot:</span>
                <strong style={{ color: 'var(--white)' }}>{d.slots}</strong>
              </div>
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.5rem',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: d.status === 'Kritik' ? 'rgba(231, 76, 60, 0.15)' : 
                            d.status === 'Bloke' ? 'rgba(85, 85, 85, 0.15)' : 'rgba(46, 204, 113, 0.15)',
                color: d.status === 'Kritik' ? 'var(--error)' : 
                       d.status === 'Bloke' ? 'var(--text-muted)' : 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                {getStatusIcon(d.status)}
                {d.status}
              </div>
              <button 
                className={styles.actionBtn} 
                style={{ marginTop: '1rem' }}
                onClick={() => handleDayDetail(d.date)}
                disabled={loadingDate === d.date}
              >
                {loadingDate === d.date ? "Yükleniyor..." : "Gün Detayı"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
