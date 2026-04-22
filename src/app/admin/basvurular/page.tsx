"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import styles from "../page.module.css";
import { getJobApplications, updateJobApplicationStatus } from "@/actions/jobApplication";
import { JobApplication } from "@/types";
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  X
} from "lucide-react";

export default function JobApplicationsAdmin() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const fetchApplications = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getJobApplications();
      if (Array.isArray(data)) {
        setApplications(data as JobApplication[]);
      } else {
        alert("Hata: Veri formatı geçersiz.");
      }
    } catch (error: any) {
      console.error("Başvurular yüklenirken hata oluştu:", error);
      alert("Hata: " + (error.message || "Başvurular alınamadı. Yetkiniz olmayabilir veya sunucu hatası oluştu."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchApplications();
    };
    init();
  }, [fetchApplications]);

  async function handleStatusUpdate(id: string, status: string) {
    await updateJobApplicationStatus(id, status);
    fetchApplications();
    setSelectedApp(null);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className={styles.statusBadge} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>Yeni</span>;
      case 'REVIEWED':
        return <span className={styles.statusBadge} style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f' }}>İncelendi</span>;
      case 'HIRED':
        return <span className={styles.statusBadge} style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' }}>İşe Alındı</span>;
      case 'REJECTED':
        return <span className={styles.statusBadge} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>Reddedildi</span>;
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Çalışan Başvuruları</h1>
        <p>Hızlı iş başvurusu formu üzerinden gelen yeni adayları buradan yönetebilirsiniz.</p>
      </div>

      <div className={styles.mainGridFull}>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>İkamet</th>
                <th>Deneyim</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Yükleniyor...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Henüz başvuru yok.</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.fullName}</td>
                    <td>{app.phone}</td>
                    <td>{app.residence}</td>
                    <td>{app.experience.substring(0, 30)}...</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Başvuru Detayı</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}><X /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Ad Soyad</label>
                  <p>{selectedApp.fullName}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Telefon</label>
                  <p>{selectedApp.phone}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>E-posta</label>
                  <p>{selectedApp.email || "Belirtilmemiş"}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Doğum Tarihi</label>
                  <p>{new Date(selectedApp.birthDate).toLocaleDateString('tr-TR')}</p>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: '1/-1' }}>
                  <label>İkametgah</label>
                  <p>{selectedApp.residence}</p>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: '1/-1' }}>
                  <label>Deneyim ve Notlar</label>
                  <p style={{ whiteSpace: 'pre-wrap', fontWeight: '400' }}>{selectedApp.experience}</p>
                </div>
              </div>

              <div className={styles.modalFooter} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <a 
                    href={`tel:${selectedApp.phone}`}
                    className={styles.approveBtn}
                    style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#3498db', color: 'white' }}
                  >
                    Hemen Ara
                  </a>
                  <a 
                    href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    className={styles.approveBtn}
                    style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#2ecc71', color: 'white' }}
                  >
                    WhatsApp
                  </a>
                </div>
                
                <a 
                  href={`mailto:${selectedApp.email}?subject=İş Başvurusu Hakkında - Zinde Temizlik`}
                  className={styles.actionBtn}
                  style={{ width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block', padding: '12px' }}
                >
                  E-posta Gönder
                </a>

                <button 
                  className={styles.actionBtn}
                  style={{ width: '100%', border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px' }}
                  onClick={() => handleStatusUpdate(selectedApp.id, 'REVIEWED')}
                >
                  İncelendi Olarak İşaretle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
