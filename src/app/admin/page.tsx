"use client";

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  X, 
  Phone, 
  MessageCircle, 
  XCircle,
  Eye
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';
import { SecurityUtils } from '@/lib/security-utils';
import { BOOKING_STATES } from '@/lib/constants';
import { getBookings, updateBookingStatus } from '@/lib/mock-db';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [resList, setResList] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'PENDING_REVIEW' | 'CONFIRMED'>('ALL');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const resp = await fetch('/api/bookings');
      let all = await resp.json();
      
      if (!Array.isArray(all)) {
        console.error("API Dashboard Error: Data is not an array. Payload:", all);
        all = [];
      }
      
      setAllBookings(all);
      
      if (isInitialLoad) {
         setIsInitialLoad(false);
         const newCount = all.filter((b: any) => b.status === 'SUBMITTED').length;
         
         if (newCount > 0) {
            // Havai fişek patlatma (eğer yeni randevu varsa)
            const duration = 2.5 * 1000;
            const animationEnd = Date.now() + duration;
            const frame = () => {
              confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#0EA5E9', '#FACC15'] });
              confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#0EA5E9', '#FACC15'] });
              if (Date.now() < animationEnd) { requestAnimationFrame(frame); }
            };
            frame();
         } else {
            // Ufak bir karşılama patlaması (yeni iş olmasa da moral için)
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 }, colors: ['#94a3b8', '#cbd5e1'] });
         }

         setTimeout(() => {
           setShowSplash(false);
         }, 4000);
      }

      if (filter !== 'ALL') {
        all = all.filter((b: any) => b.status === filter);
      }
      setResList(all.slice(0, 10)); 
    } catch (err) {
      console.error("Data load error:", err);
      setIsInitialLoad(false);
      setTimeout(() => setShowSplash(false), 2000);
    }
  };

  const handleStatusUpdate = async (id: string | number, status: string) => {
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      loadData();
      setSelectedBooking(null);
    } catch (err) {
      alert("Güncelleme başarısız.");
    }
  };

  const stats = [
    { label: "Yeni Rezervasyonlar", value: allBookings.filter(b => b.status === 'SUBMITTED').length.toString(), trend: "Tümü", icon: ClipboardList, color: "var(--accent-blue)", filterType: 'SUBMITTED' },
    { label: "İncelenmeyi Bekleyen", value: allBookings.filter(b => b.status === 'PENDING_REVIEW').length.toString(), trend: "Acil", icon: AlertTriangle, color: "var(--warning)", filterType: 'PENDING_REVIEW' },
    { label: "Onaylanan Randevular", value: allBookings.filter(b => b.status === 'CONFIRMED').length.toString(), trend: "Haftalık", icon: CheckCircle2, color: "var(--success)", filterType: 'CONFIRMED' },
    { label: "Tüm İşler", value: allBookings.length.toString(), trend: "Stabil", icon: TrendingUp, color: "var(--text-primary)", filterType: 'ALL' },
  ];

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
             initial={{ opacity: 1 }}
             exit={{ opacity: 0, y: -50 }}
             transition={{ duration: 0.6, ease: "easeInOut" }}
             style={{
               position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
               background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
               zIndex: 99999, display: 'flex', flexDirection: 'column',
               justifyContent: 'center', alignItems: 'center', color: '#fff',
             }}
          >
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem', textAlign: 'center', padding: '0 1rem' }}
            >
              Hoşgeldiniz Aysel Hanım ✨
            </motion.h1>
            {isInitialLoad ? (
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                 <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Sistem kontrol ediliyor...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                  background: allBookings.filter(b => b.status === 'SUBMITTED').length > 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <p style={{ 
                    fontSize: '1.2rem', margin: 0,
                    color: allBookings.filter(b => b.status === 'SUBMITTED').length > 0 ? '#34D399' : '#cbd5e1' 
                }}>
                  {allBookings.filter(b => b.status === 'SUBMITTED').length > 0 
                    ? `Harika haber! Göz atmanızı bekleyen ${allBookings.filter(b => b.status === 'SUBMITTED').length} yeni randevunuz var.` 
                    : "Şuanlık yeni randevular göremiyorum maalesef."}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Operasyon Merkezi</h1>
        <p>Zinde Temizlik ana yönetim ekranı.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(stat => (
          <div 
            key={stat.label} 
            className={`${styles.statCard} ${filter === stat.filterType ? styles.statCardActive : ''}`}
            onClick={() => setFilter(stat.filterType as any)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{stat.label}</span>
              <stat.icon size={16} style={{ opacity: 0.5 }} />
            </div>
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <span className={styles.statTrend}>{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainGridFull}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>
              {filter === 'SUBMITTED' ? 'Yeni Talepler' : 
               filter === 'PENDING_REVIEW' ? 'İncelemedeki Talepler' : 
               filter === 'CONFIRMED' ? 'Onaylanan Randevular' : 'Son Rezervasyon Talepleri'}
            </h3>
            {filter !== 'ALL' && <button className={styles.viewAll} onClick={() => setFilter('ALL')}>Temizle</button>}
            <button className={styles.viewAll} onClick={() => window.location.href = '/admin/rezervasyonlar'}>Tümünü Gör</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>İlçe</th>
                <th>Hizmet</th>
                <th>Zaman</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {resList.map((res: any, index: number) => (
                <tr key={res.id || index}>
                  <td data-label="Müşteri">{res.customerName || res.customer}</td>
                  <td data-label="İlçe">{res.districtId || res.district}</td>
                  <td data-label="Hizmet">{res.serviceId || res.service}</td>
                  <td data-label="Zaman">{res.startAt ? new Date(res.startAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : res.date}</td>
                  <td data-label="Durum">
                    <span className={styles.statusBadge} style={{ 
                      background: ((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).color + '22', 
                      color: ((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).color 
                    }}>
                      {((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).label}
                    </span>
                  </td>
                  <td data-label="İşlem">
                    <button 
                      className={styles.actionBtn}
                      onClick={() => setSelectedBooking(res)}
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
            <motion.div 
              className={styles.modalContent} 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h3>Randevu Detayları</h3>
                <button onClick={() => setSelectedBooking(null)} className={styles.closeBtn}><X size={20} /></button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>ID</label>
                    <p>{selectedBooking.id}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Durum</label>
                    <p style={{ color: ((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).color }}>
                      {((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).label}
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Müşteri</label>
                    <p>{selectedBooking.customer}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Telefon</label>
                    <p>{selectedBooking.phone || "Belirtilmedi"}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Hizmet</label>
                    <p>{selectedBooking.service}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Bölge</label>
                    <p>{selectedBooking.district}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Zaman</label>
                    <p>{selectedBooking.date}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Bütçe</label>
                    <p>{selectedBooking.budgetRange || selectedBooking.customBudget || "Belirtilmedi"}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Süre / Ekip</label>
                    <p>{selectedBooking.duration === 'FULL' ? 'Tam Gün' : 'Yarım Gün'} / {selectedBooking.teamSize || '1'} Kişi</p>
                  </div>
                </div>

                <div className={styles.contactActions}>
                   <a href={`tel:${selectedBooking.phone}`} className={styles.contactBtn}>
                      <Phone size={16} /> Müşteriyi Ara
                   </a>
                   <a href={`https://wa.me/${selectedBooking.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className={styles.contactBtn} style={{ background: '#25D366' }}>
                      <MessageCircle size={16} /> WhatsApp'tan Yaz
                   </a>
                </div>

                <div className={styles.modalFooter}>
                  <button 
                    className={styles.rejectBtn}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELED')}
                  >
                    <XCircle size={16} /> Reddet / İptal Et
                  </button>
                  <button 
                    className={styles.approveBtn}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                  >
                    <CheckCircle2 size={16} /> Randevuyu Onayla
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
    </>
  );
}
