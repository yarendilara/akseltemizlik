"use client";

import { useState, useEffect } from 'react';
import { Users, Search, Phone, MessageCircle, MapPin, Calendar, X, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { BOOKING_STATES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const resp = await fetch('/api/bookings');
        const data = await resp.json();
        if (Array.isArray(data)) {
          setAllBookings(data);
          
          const uniqueCustomers = new Map();
          data.forEach(b => {
             const identifier = b.customerPhone || b.customerName || 'Bilinmiyor';
             if (!uniqueCustomers.has(identifier)) {
               uniqueCustomers.set(identifier, {
                 id: b.id,
                 name: b.customerName || 'Bilinmeyen Müşteri',
                 district: b.districtId || 'Belirtilmedi',
                 phone: b.customerPhone || 'Belirtilmedi',
                 email: b.customerEmail || 'Belirtilmedi',
                 status: b.status === 'CANCELED' ? 'Pasif' : 'Aktif',
                 bookingCount: 0,
               });
             }
             // Her rezervasyonda sayacı artır
             const cust = uniqueCustomers.get(identifier);
             cust.bookingCount += 1;
          });
          setCustomers(Array.from(uniqueCustomers.values()));
        }
      } catch(err) {
        console.error("Error loading customers", err);
      }
    }
    loadCustomers();
  }, []);

  const filtered = search.trim() 
    ? customers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.phone.includes(search) ||
        c.district.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  const getCustomerBookings = (phone: string) => {
    return allBookings.filter(b => b.customerPhone === phone);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Users size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1>Müşteri Yönetimi</h1>
        </div>
        <p>Hizmet alan müşterilerin kayıtlarını ve geçmişlerini yönetin. ({customers.length} müşteri)</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Müşteri Veritabanı</h3>
          <div className={styles.searchBar} style={{ width: '300px' }}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="İsim, telefon veya bölge ara..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '3rem' }} 
            />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Bölge</th>
              <th>Telefon</th>
              <th>Toplam İş</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Müşteri bulunamadı.</td></tr>
            ) : filtered.map((cust) => (
              <tr key={cust.id}>
                <td data-label="Ad Soyad"><strong>{cust.name}</strong></td>
                <td data-label="Bölge">{cust.district}</td>
                <td data-label="Telefon">{cust.phone}</td>
                <td data-label="Toplam İş"><span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{cust.bookingCount}</span></td>
                <td data-label="Durum">
                  <span className={styles.statusBadge} style={{ 
                    background: cust.status === 'Aktif' ? '#10b98122' : '#ef444422', 
                    color: cust.status === 'Aktif' ? '#10b981' : '#ef4444' 
                  }}>
                    {cust.status}
                  </span>
                </td>
                <td data-label="İşlem">
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => setSelectedCustomer(cust)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Eye size={14} /> Profil & Geçmiş
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className={styles.modalOverlay} onClick={() => setSelectedCustomer(null)}>
            <motion.div 
              className={styles.modalContent} 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ maxWidth: '700px' }}
            >
              <div className={styles.modalHeader}>
                <h3>Müşteri Profili</h3>
                <button onClick={() => setSelectedCustomer(null)} className={styles.closeBtn}><X size={20} /></button>
              </div>
              
              <div className={styles.modalBody}>
                {/* Profile Info */}
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Ad Soyad</label>
                    <p>{selectedCustomer.name}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Telefon</label>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>E-posta</label>
                    <p>{selectedCustomer.email}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Bölge</label>
                    <p>{selectedCustomer.district}</p>
                  </div>
                </div>

                <div className={styles.contactActions}>
                   <a href={`tel:${selectedCustomer.phone}`} className={styles.contactBtn}>
                      <Phone size={16} /> Ara
                   </a>
                   <a href={`https://wa.me/90${selectedCustomer.phone?.replace(/[^0-9]/g, '').replace(/^0/, '')}`} target="_blank" className={styles.contactBtn} style={{ background: '#25D366' }}>
                      <MessageCircle size={16} /> WhatsApp
                   </a>
                </div>

                {/* Booking History */}
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    📋 Geçmiş Randevular ({getCustomerBookings(selectedCustomer.phone).length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {getCustomerBookings(selectedCustomer.phone).length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Henüz randevu kaydı yok.</p>
                    ) : getCustomerBookings(selectedCustomer.phone).map((b: any) => (
                      <div key={b.id} style={{ 
                        padding: '1rem', 
                        background: 'rgba(14,165,233,0.03)', 
                        borderRadius: '10px', 
                        border: '1px solid rgba(14,165,233,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {b.serviceId || 'Hizmet'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {b.districtId} • {formatDate(b.startAt)}
                          </div>
                        </div>
                        <span className={styles.statusBadge} style={{
                          background: ((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).color + '22',
                          color: ((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).color
                        }}>
                          {((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
