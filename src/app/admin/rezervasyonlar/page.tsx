"use client";

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  FileDown,
  Eye,
  Search,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { SecurityUtils } from '@/lib/security-utils';
import { BOOKING_STATES } from '@/lib/constants';
import { getBookings, syncClientBookings, updateBookingStatus } from '@/lib/mock-db';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReservationsAdmin() {
  const [resList, setResList] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    syncClientBookings();
    loadData();
  }, []);

  const loadData = () => {
    setResList(getBookings());
  };

  const handleStatusUpdate = (id: string | number, status: string) => {
    updateBookingStatus(id, status);
    loadData();
    setSelectedBooking(null);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <ClipboardList size={24} className={styles.accentIcon} />
          <h1>Rezervasyon Yönetimi</h1>
        </div>
        <p>Tüm randevu taleplerini ve aktif işleri buradan yönetebilirsiniz.</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.searchBar} style={{ width: '300px' }}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="ID veya müşteri ara..." style={{ width: '100%', paddingLeft: '3rem' }} />
            </div>
            <button className={styles.actionBtn}>Filtrele</button>
          </div>
          <div className={styles.tableActions}>
            <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileDown size={14} /> Excel Aktar
            </button>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Müşteri</th>
              <th>İlçe</th>
              <th>Hizmet</th>
              <th>Zaman</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {resList.map((res: any, index: number) => (
              <tr key={res.id || index}>
                <td><code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{res.id || `AKSEL-G${index}`}</code></td>
                <td>{res.customer}</td>
                <td>{res.district || "Belirtilmedi"}</td>
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
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button 
                        className={styles.actionBtn} 
                        title="İncele/Detay"
                        onClick={() => setSelectedBooking(res)}
                      >
                        <Eye size={16} /> <span style={{fontSize: '0.85rem'}}>Detay</span>
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    <p>{selectedBooking.phone}</p>
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
                    <p>{selectedBooking.duration === 'FULL' ? 'Tam Gün' : 'Yarım Gün'} / {selectedBooking.teamSize} Kişi</p>
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
