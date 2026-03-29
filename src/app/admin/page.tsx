"use client";

import { AlertTriangle, TrendingUp, Users, ClipboardList, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';
import { SecurityUtils } from '@/lib/security-utils';
import { BOOKING_STATES } from '@/lib/constants';

export default function AdminDashboard() {
  const stats = [
    { label: "Yeni Rezervasyonlar", value: "12", trend: "+15%", icon: ClipboardList, color: "var(--accent-blue)" },
    { label: "Onay Bekleyen Başvurular", value: "4", trend: "Acil", icon: Users, color: "var(--warning)" },
    { label: "Aktif Temizlikçiler", value: "28", trend: "Operasyonel", icon: CheckCircle2, color: "var(--success)" },
    { label: "Bu Ayki Toplam İş", value: "142", trend: "Stabil", icon: TrendingUp, color: "var(--text-primary)" },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Operasyon Merkezi</h1>
        <p>Aksel Temizlik ana yönetim ve atama ekranı.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(stat => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{stat.label}</span>
              <stat.icon size={16} style={{ opacity: 0.5 }} />
            </div>
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <span className={styles.statTrend}>{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Son Rezervasyon Talepleri</h3>
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
              <tr>
                <td>{SecurityUtils.maskFullName("Murat Kaçmaz")}</td>
                <td>Beşiktaş</td>
                <td>Ofis Temizliği</td>
                <td>Bugün 14:00</td>
                <td><span className={styles.statusBadge} style={{ background: BOOKING_STATES.PENDING_REVIEW.color + '22', color: BOOKING_STATES.PENDING_REVIEW.color }}>{BOOKING_STATES.PENDING_REVIEW.label}</span></td>
                <td><button className={styles.actionBtn}>Atama Yap</button></td>
              </tr>
              <tr>
                <td>{SecurityUtils.maskFullName("Selma Gür")}</td>
                <td>Kadıköy</td>
                <td>Boş Ev Temizliği</td>
                <td>24 Mart 09:00</td>
                <td><span className={styles.statusBadge} style={{ background: BOOKING_STATES.ASSIGNED.color + '22', color: BOOKING_STATES.ASSIGNED.color }}>{BOOKING_STATES.ASSIGNED.label}</span></td>
                <td><button className={styles.actionBtn}>Değiştir</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardHeader}>
            <h3>Onay Bekleyen Başvurular</h3>
          </div>
          <div className={styles.appList}>
            <div className={styles.appItem}>
              <div className={styles.appAvatar}>AY</div>
              <div className={styles.appInfo}>
                <p>Ayşe Yılmaz</p>
                <span>TC: {SecurityUtils.maskTCKN("12345678901")}</span>
                <span>Bölge: Üsküdar</span>
              </div>
              <button className={styles.actionBtn}>İncele</button>
            </div>
            <div className={styles.appItem}>
              <div className={styles.appAvatar}>ME</div>
              <div className={styles.appInfo}>
                <p>Mehmet Er</p>
                <span>TC: {SecurityUtils.maskTCKN("98765432109")}</span>
                <span>Bölge: Esenyurt</span>
              </div>
              <button className={styles.actionBtn}>İncele</button>
            </div>
          </div>
          <div className={styles.securityNote}>
            <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span>T.C. No verileri şifreli saklanmaktadır.</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
