"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  Hash,
  CalendarClock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  status: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  CONFIRMED:   { label: 'Onaylandı',      color: '#0284C7', bg: 'rgba(14,165,233,0.1)' },
  SUBMITTED:   { label: 'Değerlendirmede', color: '#B45309', bg: 'rgba(245,158,11,0.1)' },
  CANCELLED:   { label: 'İptal Edildi',   color: '#DC2626', bg: 'rgba(239,68,68,0.1)'  },
  default:     { label: 'Beklemede',      color: '#475569', bg: 'rgba(71,85,105,0.08)' },
};

function getStatus(s: string) {
  return STATUS_MAP[s] ?? STATUS_MAP.default;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aksel_bookings');
    if (saved) {
      setBookings(
        JSON.parse(saved).sort((a: Booking, b: Booking) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
    setIsLoaded(true);
  }, []);

  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

  return (
    <main className={styles.main}>
      <Navbar />

      <div className="container" style={{ paddingTop: '15vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <span className={styles.badge}>Rezervasyon Takibi</span>
          <h1>Randevularım</h1>
          <p>Bu cihaz üzerinden oluşturduğunuz randevuları buradan takip edebilirsiniz.</p>
        </motion.div>

        {!isLoaded ? (
          <div className={styles.loading}>Yükleniyor…</div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyState}
          >
            <div className={styles.emptyIcon}>
              <Search size={48} strokeWidth={1} />
            </div>
            <h3>Henüz randevunuz bulunmuyor</h3>
            <p>Hemen bir temizlik planlamak için randevu al butonunu kullanabilirsiniz.</p>
            <a href="/rezervasyon" className="btn-solid" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Yeni Randevu Al
            </a>
          </motion.div>
        ) : (
          <div className={styles.bookingList}>
            {bookings.map((booking, index) => {
              const st = getStatus(booking.status);
              const isOpen = expanded === booking.id;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={styles.bookingCard}
                >
                  {/* Main row */}
                  <div className={styles.cardMain}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.iconBox}>
                        <ClipboardList size={22} />
                      </div>
                      <div>
                        <span className={styles.idLabel}>{booking.id}</span>
                        <h3>{booking.service}</h3>
                      </div>
                    </div>

                    <div className={styles.dateTimeInfo}>
                      <div className={styles.infoRow}>
                        <Calendar size={14} />
                        <span>{booking.date}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <Clock size={14} />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    <div className={styles.statusBox}>
                      <div
                        className={styles.statusBadge}
                        style={{ color: st.color, background: st.bg }}
                      >
                        {booking.status === 'CONFIRMED'
                          ? <CheckCircle2 size={13} />
                          : <AlertCircle size={13} />}
                        {st.label}
                      </div>
                    </div>

                    <button
                      className={`${styles.detailBtn} ${isOpen ? styles.detailBtnOpen : ''}`}
                      onClick={() => toggle(booking.id)}
                      aria-expanded={isOpen}
                    >
                      <span>Detaylar</span>
                      <ChevronDown size={15} className={styles.chevron} />
                    </button>
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className={styles.detailPanel}>
                          <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <Hash size={13} /> Randevu No
                              </span>
                              <span className={styles.detailValue}>{booking.id}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <ClipboardList size={13} /> Hizmet Türü
                              </span>
                              <span className={styles.detailValue}>{booking.service}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <Calendar size={13} /> Tarih
                              </span>
                              <span className={styles.detailValue}>{booking.date}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <Clock size={13} /> Saat
                              </span>
                              <span className={styles.detailValue}>{booking.time}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <AlertCircle size={13} /> Durum
                              </span>
                              <span
                                className={styles.detailValue}
                                style={{ color: st.color, fontWeight: 600 }}
                              >
                                {st.label}
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                <CalendarClock size={13} /> Oluşturulma
                              </span>
                              <span className={styles.detailValue}>
                                {new Date(booking.createdAt).toLocaleDateString('tr-TR', {
                                  day: '2-digit', month: 'long', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                          <p className={styles.detailNote}>
                            Randevu durumu hakkında bilgi almak için randevu numaranızı operasyon merkezimizle paylaşabilirsiniz.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className={styles.securityNote}>
          <AlertCircle size={15} />
          <p>
            Cihazınızın çerezlerini veya tarama verilerini silmeniz durumunda bu listedeki erişiminiz kaybolabilir.
            Lütfen randevu numaranızı not alınız.
          </p>
        </div>
      </div>
    </main>
  );
}
