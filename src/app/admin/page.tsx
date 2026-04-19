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
  Eye,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';
import { BOOKING_STATES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  const [showSplash, setShowSplash] = useState(false);
  const [resList, setResList] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'PENDING_REVIEW' | 'CONFIRMED'>('ALL');

  useEffect(() => {
    // Splash sadece login'den gelince gösterilsin
    const justLoggedIn = sessionStorage.getItem('admin_just_logged_in');
    if (justLoggedIn === 'true') {
      setShowSplash(true);
      sessionStorage.removeItem('admin_just_logged_in');
    }
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const resp = await fetch('/api/bookings');
      let all = await resp.json();
      
      if (!Array.isArray(all)) {
        all = [];
      }
      
      setAllBookings(all);

      // Splash animasyonu (sadece login sonrası)
      if (showSplash) {
        const newCount = all.filter((b: any) => b.status === 'SUBMITTED').length;
        if (newCount > 0) {
          const duration = 2.5 * 1000;
          const animationEnd = Date.now() + duration;
           const frame = () => {
             confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#0EA5E9', '#FACC15'] });
             confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#0EA5E9', '#FACC15'] });
             if (Date.now() < animationEnd) { requestAnimationFrame(frame); }
           };
           frame();
        } else {
          confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 }, colors: ['#94a3b8', '#cbd5e1'] });
        }
        setTimeout(() => setShowSplash(false), 3500);
      }

      let filtered = [...all];
      if (filter !== 'ALL') {
        filtered = filtered.filter((b: any) => b.status === filter);
      }
      setResList(filtered.slice(0, 10)); 
    } catch (err) {
      console.error("Data load error:", err);
      setShowSplash(false);
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Belirtilmedi';
    try {
      return new Date(dateStr).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  const newCount = allBookings.filter(b => b.status === 'SUBMITTED').length;
  const pendingCount = allBookings.filter(b => b.status === 'PENDING_REVIEW').length;
  const confirmedCount = allBookings.filter(b => b.status === 'CONFIRMED').length;

  const stats = [
    { label: "Yeni Talepler", value: newCount.toString(), trend: newCount > 0 ? "Aksiyon Gerekli" : "Temiz", icon: ClipboardList, color: "#0EA5E9", filterType: 'SUBMITTED' },
    { label: "İncelemede", value: pendingCount.toString(), trend: pendingCount > 0 ? "Bekliyor" : "Yok", icon: AlertTriangle, color: "#f59e0b", filterType: 'PENDING_REVIEW' },
    { label: "Onaylanan", value: confirmedCount.toString(), trend: "Aktif", icon: CheckCircle2, color: "#10b981", filterType: 'CONFIRMED' },
    { label: "Toplam İş", value: allBookings.length.toString(), trend: "Tüm Zamanlar", icon: TrendingUp, color: "#64748b", filterType: 'ALL' },
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
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                background: newCount > 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <p style={{ 
                  fontSize: '1.2rem', margin: 0,
                  color: newCount > 0 ? '#34D399' : '#cbd5e1' 
              }}>
                {newCount > 0 
                  ? `🎉 ${newCount} yeni randevu talebi sizi bekliyor!` 
                  : "Şuanlık yeni randevu talebi yok."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Operasyon Merkezi</h1>
        <p>Zinde Temizlik — Tüm randevuları tek ekrandan yönetin.</p>
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
              {filter === 'SUBMITTED' ? '🆕 Yeni Talepler' : 
               filter === 'PENDING_REVIEW' ? '⏳ İncelemedeki Talepler' : 
               filter === 'CONFIRMED' ? '✅ Onaylanan Randevular' : '📋 Son Rezervasyon Talepleri'}
            </h3>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {filter !== 'ALL' && <button className={styles.viewAll} onClick={() => setFilter('ALL')}>Filtreyi Temizle</button>}
              <button className={styles.viewAll} onClick={() => window.location.href = '/admin/rezervasyonlar'}>Tümünü Gör →</button>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>İlçe</th>
                <th>Hizmet</th>
                <th>Tarih & Saat</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {resList.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Henüz kayıt bulunmuyor.</td></tr>
              ) : resList.map((res: any, index: number) => (
                <tr key={res.id || index}>
                  <td data-label="Müşteri"><strong>{res.customerName || 'Belirtilmedi'}</strong></td>
                  <td data-label="İlçe">{res.districtId || 'Belirtilmedi'}</td>
                  <td data-label="Hizmet">{res.serviceId || 'Belirtilmedi'}</td>
                  <td data-label="Tarih">{formatDate(res.startAt)}</td>
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
                      <Eye size={14} /> Detay
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
                    <label>Durum</label>
                    <p style={{ color: ((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).color }}>
                      {((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).label}
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Müşteri</label>
                    <p>{selectedBooking.customerName || 'Belirtilmedi'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Telefon</label>
                    <p>{selectedBooking.customerPhone || 'Belirtilmedi'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>E-posta</label>
                    <p>{selectedBooking.customerEmail || 'Belirtilmedi'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Hizmet</label>
                    <p>{selectedBooking.serviceId || 'Belirtilmedi'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Bölge</label>
                    <p>{selectedBooking.districtId || 'Belirtilmedi'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Tarih & Saat</label>
                    <p>{formatDate(selectedBooking.startAt)}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Adres</label>
                    <p>{selectedBooking.address || 'Belirtilmedi'}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(14,165,233,0.05)', borderRadius: '8px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Notlar</label>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{selectedBooking.notes}</p>
                  </div>
                )}

                <div className={styles.contactActions}>
                   <a href={`tel:${selectedBooking.customerPhone}`} className={styles.contactBtn}>
                      <Phone size={16} /> Müşteriyi Ara
                   </a>
                   <a href={`https://wa.me/90${selectedBooking.customerPhone?.replace(/[^0-9]/g, '').replace(/^0/, '')}`} target="_blank" className={styles.contactBtn} style={{ background: '#25D366' }}>
                      <MessageCircle size={16} /> WhatsApp
                   </a>
                </div>

                <div className={styles.modalFooter}>
                  <button 
                    className={styles.rejectBtn}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELED')}
                  >
                    <XCircle size={16} /> Reddet / İptal
                  </button>
                  <button 
                    className={styles.approveBtn}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                  >
                    <CheckCircle2 size={16} /> Onayla
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
