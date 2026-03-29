"use client";

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  FileDown,
  Eye,
  Settings2,
  Search,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { SecurityUtils } from '@/lib/security-utils';
import { BOOKING_STATES } from '@/lib/constants';
import { getBookings, getCleaners, assignBooking, syncClientBookings } from '@/lib/mock-db';

export default function ReservationsAdmin() {
  const [resList, setResList] = useState<any[]>([]);
  const [cleaners, setCleaners] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [assigningTo, setAssigningTo] = useState<string | number | null>(null);
  const [selectedCleaner, setSelectedCleaner] = useState<number | ''>('');

  useEffect(() => {
    syncClientBookings();
    setResList(getBookings());
    setCleaners(getCleaners());
  }, []);

  const handleStatusChange = (id: string | number) => {
    setLoadingId(id);
    setTimeout(() => {
      // Find and assign booking
      if (selectedCleaner) {
        assignBooking(id as number, Number(selectedCleaner));
        setResList(getBookings());
        setAssigningTo(null);
      } else {
        alert("Lütfen bir temizlikçi seçin.");
      }
      setLoadingId(null);
    }, 600);
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
                <td><code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{res.id ? (res.id.toString().startsWith("AKSEL") ? res.id : `AKSEL-${res.id + 101234}`) : `AKSEL-G${index}`}</code></td>
                <td>{res.customer ? SecurityUtils.maskFullName(res.customer) : "Belirtilmedi"}</td>
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
                  {res.cleanerId && <div style={{fontSize: '0.8rem', marginTop:'4px', color: 'var(--text-muted)'}}>Temizlikçi ID: {res.cleanerId}</div>}
                </td>
                <td>
                  {assigningTo === res.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select value={selectedCleaner} onChange={(e) => setSelectedCleaner(Number(e.target.value))} style={{ padding:'4px', borderRadius:'4px', border:'1px solid var(--border)'}}>
                               <option value="">Seçiniz...</option>
                               {cleaners.map((c: any) => {
                                   const bookingDatePart = res.date.split(' ')[0];
                                   const isUnavailable = c.unavailableDates?.includes(bookingDatePart);
                                   return (
                                       <option key={c.id} value={c.id} disabled={isUnavailable}>
                                           {c.name} {isUnavailable ? "(M müsait değil)" : ""}
                                       </option>
                                   );
                               })}
                            </select>
                           <button className={styles.actionBtn} style={{ color: 'var(--accent-blue-hover)' }} onClick={() => handleStatusChange(res.id)} disabled={loadingId === res.id}>Ata</button>
                           <button onClick={() => setAssigningTo(null)} style={{background:'none', border:'none', cursor:'pointer', color:'var(--danger)'}}>X</button>
                      </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button className={styles.actionBtn} title="Detay">
                          <Eye size={16} />
                        </button>
                        <button
                          className={styles.actionBtn}
                          style={{ color: 'var(--accent-blue-hover)' }}
                          onClick={() => setAssigningTo(res.id)}
                          title="Atama Yap"
                        >
                           <UserCheck size={16} />
                        </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {resList.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Henüz aktif bir kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
