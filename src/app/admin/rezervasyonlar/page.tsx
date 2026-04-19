"use client";

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Eye,
  Search,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { BOOKING_STATES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReservationsAdmin() {
  const [resList, setResList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...resList];
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r => 
        (r.customerName || '').toLowerCase().includes(q) ||
        (r.customerPhone || '').includes(q) ||
        (r.districtId || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q)
      );
    }
    setFilteredList(filtered);
  }, [resList, search, statusFilter]);

  const loadData = async () => {
    const resp = await fetch('/api/bookings');
    const data = await resp.json();
    if (Array.isArray(data)) {
      setResList(data);
    }
  };

  const handleStatusUpdate = async (id: string | number, status: string) => {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadData();
    setSelectedBooking(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Belirtilmedi';
    try {
      return new Date(dateStr).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <ClipboardList size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1>Rezervasyon Yönetimi</h1>
        </div>
        <p>Tüm randevu taleplerini buradan yönetebilirsiniz. ({resList.length} kayıt)</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="İsim, telefon veya ilçe ara..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '3rem' }} 
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.2)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="SUBMITTED">İletildi</option>
              <option value="PENDING_REVIEW">İncelemede</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="CANCELED">İptal Edildi</option>
            </select>
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
            {filteredList.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Kayıt bulunamadı.</td></tr>
            ) : filteredList.map((res: any, index: number) => (
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
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Eye size={14} /> Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
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
                    <XCircle size={16} /> İptal Et
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
  );
}
