"use client";

import { User, History, Shield, Search, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { SecurityUtils } from '@/lib/security-utils';

const CUSTOMERS = [
  { id: 1, name: "Murat Kaçmaz", district: "Beşiktaş", phone: "0533-XXX-XX-XX", status: "Aktif" },
  { id: 2, name: "Selma Gür", district: "Kadıköy", phone: "0532-XXX-XX-XX", status: "Aktif" },
  { id: 3, name: "Ahmet Ergin", district: "Üsküdar", phone: "0540-XXX-XX-XX", status: "İncelemede" },
];

export default function CustomersAdmin() {
  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Müşteri Yönetimi</h1>
        <p>Hizmet alan müşterilerin kayıtlarını ve geçmişlerini yönetin.</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Users size={20} className={styles.accentIcon} />
            <h3>Müşteri Veritabanı</h3>
          </div>
          <div className={styles.searchBar} style={{ width: '300px' }}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="İsim veya telefon ara..." style={{ width: '100%', paddingLeft: '3rem' }} />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Bölge</th>
              <th>Telefon</th>
              <th>Durum</th>
              <th>Geçmiş İşler</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((cust) => (
              <tr key={cust.id}>
                <td><strong>{SecurityUtils.maskFullName(cust.name)}</strong></td>
                <td>{cust.district}</td>
                <td>{cust.phone}</td>
                <td><span className={styles.statusBadge} style={{ background: '#3498DB22', color: '#3498DB' }}>{cust.status}</span></td>
                <td>
                  <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Müşteri geçmişi yükleniyor...")}>
                    <History size={14} /> Tümünü Gör
                  </button>
                </td>
                <td>
                  <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Müşteri profili açılıyor...")}>
                    <User size={14} /> Profil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
