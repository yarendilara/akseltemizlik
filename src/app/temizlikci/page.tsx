"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getCleaners, getBookings, getNotifications, getLoggedInCleaner, cleanerLogout, setCleanerAvailability } from '@/lib/mock-db';
import { Bell, MapPin, Calendar, LogOut } from 'lucide-react';

export default function CleanerDashboard() {
  const [cleaner, setCleaner] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = getLoggedInCleaner();
    if (!loggedIn) {
        router.push('/temizlikci/login');
        return;
    }
    setCleaner(loggedIn);
    setUnavailableDates(loggedIn.unavailableDates || []);
    setLoading(false);
    
    // Initial fetch
    const fetchJobs = () => {
        const allJobs = getBookings();
        setJobs(allJobs.filter((b: any) => Number(b.cleanerId) === Number(loggedIn.id)));
        setNotifications(getNotifications(loggedIn.id));
    };
    
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const toggleDate = (date: string) => {
    setUnavailableDates(prev => {
        const next = prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date];
        setCleanerAvailability(cleaner.id, next);
        return next;
    });
  };

  const monthDates = Array.from({length: 30}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const handleLogout = () => {
    cleanerLogout();
    router.push('/temizlikci/login');
  };

  if (loading || !cleaner) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Yükleniyor...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Merhaba, {cleaner.name.split(' ')[0]} 🧼</h1>
              <p>Bugün için {jobs.length} bekleyen işin var.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Bell size={24} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)' }}>
                 <LogOut size={20}/> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {notifications.length > 0 && (
         <div className="container" style={{ marginTop: '20px' }}>
             <div style={{ background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', padding: '15px' }}>
                 <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} fill="var(--warning)"/> E-Posta Bildirimleri (Simüle)</h3>
                 {notifications.map((n, i) => (
                    <div key={i} style={{ padding: '10px', background: '#fff', borderRadius: '4px', marginBottom: '8px', fontSize: '14px', borderLeft: '3px solid var(--accent-blue)', color: '#333' }}>
                       <strong>{n.date}:</strong> {n.message}
                    </div>
                 ))}
             </div>
         </div>
      )}

      <section className={styles.jobsSection}>
        <div className="container">
          <h2>Atanan İşlerim ({jobs.length})</h2>
          <div className={styles.jobList}>
            {jobs.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Şu anda size atanmış bir iş bulunmamaktadır.</p> : jobs.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobBadge}>{job.status}</div>
                <div className={styles.jobType}>{job.service}</div>
                <div className={styles.jobInfo}>
                  <div className={styles.infoLine}><Calendar size={14}/> <strong>{job.date}</strong></div>
                  <div className={styles.infoLine}><MapPin size={14}/> {job.district} / {job.address || 'Adres detayları admin tarafından girilmedi'}</div>
                  <div className={styles.infoLine}>🤝 Müşteri: {job.customer}</div>
                </div>
                <div className={styles.jobActions}>
                  <button className="btn-solid" style={{ width: '100%' }}>Detayları Gör / Harita</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.availability}>
        <div className="container">
          <div className={styles.availCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Çalışma Müsaitliğim</h3>
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '3px' }}/> Müsait</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', background: 'var(--danger)', borderRadius: '3px' }}/> Kapalı</span>
                </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
               Aşağıdaki takvimden çalışamayacağın günlerin üzerine tıklayarak sistemde kendini <strong>"Müsait Değil"</strong> olarak işaretle. 
               Bu durumda admin sana o tarihte iş atayamayacaktır.
            </p>
            
            <div className={styles.calendarSim}>
              <div className={styles.calGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {monthDates.map(date => {
                    const isUnavailable = unavailableDates.includes(date);
                    const dayNum = new Date(date).getDate();
                    return (
                        <div 
                            key={date} 
                            onClick={() => toggleDate(date)}
                            style={{ 
                                padding: '15px 10px', 
                                background: isUnavailable ? 'var(--danger)' : 'var(--bg-accent)', 
                                color: isUnavailable ? 'white' : 'var(--text-primary)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{dayNum}</div>
                            <div style={{ fontSize: '10px', marginTop: '4px' }}>{isUnavailable ? 'KAPALI' : 'AÇIK'}</div>
                        </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
