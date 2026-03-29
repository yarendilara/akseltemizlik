"use client";

import { useState, useEffect } from 'react';
import { Star, UserPlus, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { getCleaners, addCleaner, updateCleanerPassword } from '@/lib/mock-db';
import { Key } from 'lucide-react';

export default function CleanersAdmin() {
  const [cleaners, setCleaners] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCleaner, setNewCleaner] = useState({ name: '', district: '', phone: '', email: '' });
  const [passUpdateId, setPassUpdateId] = useState<number | null>(null);
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    setCleaners(getCleaners());
  }, []);

  const handleUpdatePassword = () => {
    if (!newPass || !passUpdateId) return;
    updateCleanerPassword(passUpdateId, newPass);
    alert("Şifre başarıyla güncellendi.");
    setPassUpdateId(null);
    setNewPass("");
  };

  const handleEdit = (id: number) => {
    setLoadingId(id);
    setTimeout(() => {
      alert(id + " ID'li temizlikçi kartı düzenleme için açılıyor...");
      setLoadingId(null);
    }, 500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCleaner.name || !newCleaner.email) return;
    const added = addCleaner(newCleaner);
    setCleaners([...cleaners, added]);
    setNewCleaner({ name: '', district: '', phone: '', email: '' });
    setShowAddForm(false);
    alert("Temizlikçi başarıyla eklendi, panellerine erişebilirler.");
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Temizlikçilerimiz</h1>
        <p>Sistemde kayıtlı, onaylanmış profesyonel hizmet verenlerin listesi.</p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Aktif Temizlikçiler</h3>
          <button className={styles.actionBtn} onClick={() => setShowAddForm(true)}>
            <UserPlus size={16} /> Yeni Temizlikçi Ekle
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: '20px', backgroundColor: 'var(--bg-accent)', borderBottom: '1px solid var(--border)', borderRadius: '8px', marginBottom: '1rem' }}>
             <h4 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Yeni Temizlikçi Ekle (Aktivasyonlu)
                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
             </h4>
             <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Ad Soyad" value={newCleaner.name} onChange={e => setNewCleaner({...newCleaner, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', flex: 1 }} />
                <input type="text" placeholder="İlçe (Örn: Kadıköy)" value={newCleaner.district} onChange={e => setNewCleaner({...newCleaner, district: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', flex: 1 }} />
                <input type="tel" placeholder="Telefon" value={newCleaner.phone} onChange={e => setNewCleaner({...newCleaner, phone: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', flex: 1 }} />
                <input type="email" placeholder="E-Posta (Bildirimler İçin)" value={newCleaner.email} onChange={e => setNewCleaner({...newCleaner, email: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', flex: 1 }} />
                <button type="submit" className="btn-solid" style={{ padding: '8px 16px' }}>Kaydet</button>
             </form>
          </div>
        )}

        {passUpdateId && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '400px', width: '100%' }}>
                    <h3 style={{ marginBottom: '10px' }}>🔐 Şifre Sıfırla</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Seçili çalışan için yeni bir giriş şifresi belirleyin.
                    </p>
                    <input 
                       type="text" 
                       placeholder="Yeni Güçlü Şifre" 
                       value={newPass}
                       onChange={e => setNewPass(e.target.value)}
                       style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', marginBottom: '20px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-solid" style={{ flex: 1 }} onClick={handleUpdatePassword}>Şifreyi Güncelle</button>
                        <button className={styles.actionBtn} style={{ flex: 1 }} onClick={() => setPassUpdateId(null)}>İptal</button>
                    </div>
                </div>
            </div>
        )}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>İsim</th>
              <th>Bölge</th>
              <th>İletişim</th>
              <th>E-Posta</th>
              <th>Puan</th>
              <th>Şifre</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {cleaners.map((c: any) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.district}</td>
                <td>{c.phone}</td>
                <td>{c.email || 'Yok'}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={14} fill="var(--accent-blue)" stroke="none" /> {c.score}
                  </span>
                </td>
                <td><code>{c.password}</code></td>
                <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className={styles.actionBtn} onClick={() => setPassUpdateId(c.id)}>
                           <Key size={14} /> Şifre Sıfırla
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleEdit(c.id)} disabled={loadingId === c.id}>{loadingId === c.id ? "..." : "Düzenle"}</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
