"use client";

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { BOOKING_STATES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarAdmin() {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resp = await fetch('/api/bookings');
      const data = await resp.json();
      if (Array.isArray(data)) {
        setAllBookings(data);
      }
    } catch (err) {
      console.error("Calendar load error:", err);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadData();
    setSelectedBooking(null);
  };

  // Calendar helpers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayLabels = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group bookings by date
  const bookingsByDate: Record<string, any[]> = {};
  allBookings.forEach(b => {
    if (b.startAt) {
      const d = new Date(b.startAt).toISOString().split('T')[0];
      if (!bookingsByDate[d]) bookingsByDate[d] = [];
      bookingsByDate[d].push(b);
    }
  });

  const getDateStr = (dayNum: number) => {
    const d = new Date(year, month, dayNum);
    return d.toISOString().split('T')[0];
  };

  const getBookingsForDate = (dateStr: string) => bookingsByDate[dateStr] || [];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <CalendarIcon size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1>Operasyon Takvimi</h1>
        </div>
        <p>Takvimde bir güne tıklayarak o güne ait randevuları görüntüleyin ve yönetin.</p>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Toplam Randevu</span>
            <CalendarIcon size={16} style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.statValue} style={{ color: '#0EA5E9' }}>{allBookings.length}</div>
          <span className={styles.statTrend}>Tüm zamanlar</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Bu Ay</span>
            <Clock size={16} style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.statValue} style={{ color: '#10b981' }}>
            {allBookings.filter(b => {
              if (!b.startAt) return false;
              const d = new Date(b.startAt);
              return d.getMonth() === month && d.getFullYear() === year;
            }).length}
          </div>
          <span className={styles.statTrend}>{monthNames[month]} {year}</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Randevulu Gün</span>
            <CheckCircle2 size={16} style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{Object.keys(bookingsByDate).length}</div>
          <span className={styles.statTrend}>Farklı gün</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={styles.tableCard}>
        <div style={{ padding: '1rem' }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <button onClick={prevMonth} style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={24} />
            </button>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {monthNames[month]} {year}
            </h2>
            <button onClick={nextMonth} style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Day Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayLabels.map(label => (
              <div key={label} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = getDateStr(dayNum);
              const dayBookings = getBookingsForDate(dateStr);
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;
              const hasBookings = dayBookings.length > 0;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  style={{
                    padding: '0.8rem 0.4rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #0EA5E9' : isToday ? '2px solid rgba(14,165,233,0.3)' : '1px solid transparent',
                    background: isSelected ? 'rgba(14,165,233,0.08)' : hasBookings ? 'rgba(16,185,129,0.05)' : 'transparent',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: isToday || isSelected ? 700 : 500,
                    color: isSelected ? '#0EA5E9' : isToday ? '#0EA5E9' : 'var(--text-primary)'
                  }}>
                    {dayNum}
                  </div>
                  {hasBookings && (
                    <div style={{ 
                      marginTop: '4px', 
                      fontSize: '0.65rem', 
                      fontWeight: 700,
                      color: '#10b981',
                      background: '#10b98115',
                      borderRadius: '4px',
                      padding: '1px 4px'
                    }}>
                      {dayBookings.length} iş
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Detail */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={styles.tableCard}
            style={{ marginTop: '1.5rem' }}
          >
            <div className={styles.cardHeader}>
              <h3>
                📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })} 
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  ({selectedDateBookings.length} randevu)
                </span>
              </h3>
              <button className={styles.closeBtn} onClick={() => setSelectedDate(null)}>
                <X size={18} />
              </button>
            </div>

            {selectedDateBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Bu tarihte randevu bulunmuyor.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem 1rem' }}>
                {selectedDateBookings.map(b => (
                  <div key={b.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(14,165,233,0.1)',
                    background: 'rgba(14,165,233,0.02)',
                    flexWrap: 'wrap',
                    gap: '0.8rem'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {b.customerName || 'İsimsiz'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        {b.serviceId} • {b.districtId} • {formatTime(b.startAt)}
                      </div>
                    </div>
                    <span className={styles.statusBadge} style={{
                      background: ((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).color + '22',
                      color: ((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).color
                    }}>
                      {((BOOKING_STATES as any)[b.status] || BOOKING_STATES.SUBMITTED).label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={styles.actionBtn} onClick={() => setSelectedBooking(b)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Eye size={14} /> Detay
                      </button>
                      {b.status !== 'CONFIRMED' && (
                        <button 
                          className={styles.approveBtn} 
                          onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <CheckCircle2 size={14} /> Onayla
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Detail Modal */}
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
                  <div className={styles.detailItem}><label>Müşteri</label><p>{selectedBooking.customerName}</p></div>
                  <div className={styles.detailItem}><label>Telefon</label><p>{selectedBooking.customerPhone}</p></div>
                  <div className={styles.detailItem}><label>Hizmet</label><p>{selectedBooking.serviceId}</p></div>
                  <div className={styles.detailItem}><label>Bölge</label><p>{selectedBooking.districtId}</p></div>
                  <div className={styles.detailItem}><label>Adres</label><p>{selectedBooking.address || '-'}</p></div>
                  <div className={styles.detailItem}><label>Durum</label>
                    <p style={{ color: ((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).color }}>
                      {((BOOKING_STATES as any)[selectedBooking.status] || BOOKING_STATES.SUBMITTED).label}
                    </p>
                  </div>
                </div>
                <div className={styles.contactActions}>
                  <a href={`tel:${selectedBooking.customerPhone}`} className={styles.contactBtn}><Phone size={16} /> Ara</a>
                  <a href={`https://wa.me/90${selectedBooking.customerPhone?.replace(/[^0-9]/g, '').replace(/^0/, '')}`} target="_blank" className={styles.contactBtn} style={{ background: '#25D366' }}><MessageCircle size={16} /> WhatsApp</a>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.rejectBtn} onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELED')}><XCircle size={16} /> İptal</button>
                  <button className={styles.approveBtn} onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}><CheckCircle2 size={16} /> Onayla</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
