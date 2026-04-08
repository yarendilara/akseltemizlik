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

export default function AdminDashboard() {
  const [resList, setResList] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'PENDING_REVIEW' | 'CONFIRMED'>('ALL');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = () => {
    let all = getBookings();
    if (filter !== 'ALL') {
      all = all.filter((b: any) => b.status === filter);
    }
    setResList(all.slice(-10).reverse());
  };

  const handleStatusUpdate = (id: string | number, status: string) => {
    updateBookingStatus(id, status);
    loadData();
    setSelectedBooking(null);
  };

  const stats = [
    { label: "Yeni Rezervasyonlar", value: "12", trend: "Tümü", icon: ClipboardList, color: "var(--accent-blue)", filterType: 'SUBMITTED' },
    { label: "İncelenmeyi Bekleyen", value: "4", trend: "Acil", icon: AlertTriangle, color: "var(--warning)", filterType: 'PENDING_REVIEW' },
    { label: "Onaylanan Randevular", value: "85", trend: "Haftalık", icon: CheckCircle2, color: "var(--success)", filterType: 'CONFIRMED' },
    { label: "Tüm İşler", value: "142", trend: "Stabil", icon: TrendingUp, color: "var(--text-primary)", filterType: 'ALL' },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Operasyon Merkezi</h1>
        <p>Aksel Temizlik ana yönetim ekranı.</p>
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
                  <td>{res.customer}</td>
                  <td>{res.district}</td>
                  <td>{res.service}</td>
                  <td>{res.date}</td>
                  <td>
                    <span className={styles.statusBadge} style={{ 
                      background: ((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).color + '22', 
                      color: ((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).color 
                    }}>
                      {((BOOKING_STATES as any)[res.status] || BOOKING_STATES.SUBMITTED).label}
                    </span>
                  </td>
                  <td>
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
  );
}
