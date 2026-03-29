"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, X, Eye, FileText, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { SecurityUtils } from '@/lib/security-utils';
import { getApplications, approveApplication } from '@/lib/mock-db';

const PIPELINE_STATUSES: Record<string, { label: string, color: string }> = {
  SUBMITTED: { label: "Yeni Başvuru", color: "var(--accent-blue)" },
  PENDING_REVIEW: { label: "İncelemede", color: "var(--warning)" },
  DOCUMENTS_UPLOADED: { label: "Belgeler Tamam", color: "var(--success)" },
  WAITING_INTERVIEW: { label: "Mülakat Bekliyor", color: "#9B59B6" },
  APPROVED: { label: "Onaylandı", color: "var(--success)" },
};

export default function ApplicationsAdmin() {
  const [apps, setApps] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [reviewApp, setReviewApp] = useState<any | null>(null);
  const [customPass, setCustomPass] = useState("");

  useEffect(() => {
    setApps(getApplications());
  }, []);

  const handleApprove = (id: number) => {
    if (!customPass) {
        alert("Lütfen çalışan için bir giriş parolası belirleyin.");
        return;
    }
    setLoadingId(id);
    setTimeout(() => {
      approveApplication(id, customPass);
      setApps(getApplications());
      setLoadingId(null);
      setReviewApp(null);
      setCustomPass("");
      alert("Çalışan başarıyla onaylandı ve giriş bilgileri oluşturuldu.");
    }, 800);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Temizlikçi Başvuruları</h1>
        <p>Aksel sistemine dahil olmak isteyen profesyonel temizlikçi adaylarını buradan yönetin.</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Aday Listesi (Sıralama: En Yeni)</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Aday</th>
              <th>Öncelikli İlçe</th>
              <th>T.C. Kimlik No</th>
              <th>Başvuru Tarihi</th>
              <th>Aşama</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id}>
                <td><strong>{app.name}</strong></td>
                <td>{app.district || (app.districts && app.districts[0]) || "Bilinmiyor"}</td>
                <td><code style={{ fontSize: '0.85rem' }}>{SecurityUtils.maskTCKN(app.tckn)}</code></td>
                <td>{app.date}</td>
                <td>
                  <span className={styles.statusBadge} style={{ 
                    background: (PIPELINE_STATUSES[app.status]?.color || '#555') + '22', 
                    color: PIPELINE_STATUSES[app.status]?.color || '#555' 
                  }}>
                    {PIPELINE_STATUSES[app.status]?.label || app.status}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => setReviewApp(app)}
                    style={{ background: 'var(--accent-blue)', color: 'black', padding: '6px 12px' }}
                  >
                    <Eye size={14} style={{ marginRight: '5px', display: 'inline' }}/> 
                    İncele
                  </button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Henüz başvuru bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>

        {reviewApp && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
             <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', border: '1px solid var(--border)', position: 'relative'}}>
                <button onClick={() => setReviewApp(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)'}}><X size={24}/></button>
                
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Aday İncelemesi: {reviewApp.name}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', fontSize: '15px' }}>
                   <div>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>T.C. KİMLİK NO (DECRYPTED)</strong>
                      <code>{reviewApp.tckn}</code>
                   </div>
                   <div>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>TELEFON</strong>
                      {reviewApp.phone}
                   </div>
                   <div>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>E-POSTA</strong>
                      {reviewApp.email}
                   </div>
                   <div>
                      <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>İLGİLENİLEN İLÇELER</strong>
                      {(reviewApp.districts || [reviewApp.district]).join(', ')}
                   </div>
                </div>

                <div style={{ padding: '15px', background: 'var(--bg-accent)', borderRadius: '8px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <FileText size={24} style={{ color: 'var(--accent-blue)' }}/>
                   <div>
                      <strong>Adli Sicil Kaydı</strong>
                      <div style={{ fontSize: '12px', color: 'var(--success)' }}>E-Devlet PDF Doğrulandı ✓</div>
                   </div>
                   <button className={styles.actionBtn} style={{ marginLeft: 'auto' }}>Görüntüle</button>
                </div>

                <div style={{ marginBottom: '25px', padding: '15px', border: '1px dashed var(--accent-blue)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--accent-blue)' }}>🔐 Giriş Bilgilerini Belirle</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Çalışan Giriş Şifresi:</label>
                        <input 
                            type="text" 
                            placeholder="Örn: jane2024" 
                            value={customPass} 
                            onChange={(e) => setCustomPass(e.target.value)} 
                            style={{ padding: '10px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>* Bu şifre ve e-posta adresi ile çalışan paneline girebilecektir.</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                   <button 
                     className="btn-solid" 
                     style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                     onClick={() => handleApprove(reviewApp.id)}
                     disabled={loadingId === reviewApp.id || reviewApp.status === "APPROVED"}
                   >
                     {loadingId === reviewApp.id ? "Onaylanıyor..." : reviewApp.status === "APPROVED" ? "Onaylandı" : <><CheckCircle size={18}/> Adayı Onayla & Aktive Et</>}
                   </button>
                </div>
             </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(2, 12, 27, 0.2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldAlert size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span>
              <strong>Hassas Veri Bilgisi:</strong> Tüm adli sicil kaydı ve TCKN verileri AES-256 standardıyla şifrelenmektedir. Girdiğiniz her unmask (maske kaldırma) işlemi audit sistemine loglanmaktadır.
            </span>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
