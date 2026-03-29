"use client";

import { useState, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  Layers, 
  LayoutGrid, 
  Plus,
  Trash2,
  X,
  Hourglass
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '../page.module.css';
import { getServices, updateService, addService } from '@/lib/mock-db';

const IconMap: any = {
  Home,
  Building2,
  Layers,
  LayoutGrid
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
     id: '',
     name: '',
     duration: 60,
     buffer: 30,
     icon: 'Home'
  });

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleEdit = (id: string, s: any) => {
    setEditingId(id);
    setFormData({ id: id, name: s.name, duration: s.duration, buffer: s.buffer, icon: s.icon });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ id: '', name: '', duration: 120, buffer: 30, icon: 'Home' });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateService(editingId, { 
            name: formData.name, 
            duration: Number(formData.duration), 
            buffer: Number(formData.buffer), 
            icon: formData.icon 
        });
    } else {
        const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
        addService(newId, { 
            name: formData.name, 
            duration: Number(formData.duration), 
            buffer: Number(formData.buffer), 
            icon: formData.icon 
        });
    }
    setServices(getServices());
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className={styles.dashHeader}>
        <h1>Hizmet Portfolyosu</h1>
        <p>Hizmet sürelerini ve hazırlık sürelerini buradan güncelleyebilirsiniz.</p>
      </div>

      <div className={styles.statsGrid}>
        {Object.entries(services).map(([id, s]: [string, any]) => {
          const Icon = IconMap[s.icon] || LayoutGrid;
          return (
            <div key={id} className={styles.statCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--accent-blue)', marginBottom: '1.5rem' }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
              </div>
              
              <h4 style={{ color: 'var(--white)', marginBottom: '0.8rem', fontSize: '1.25rem' }}>{s.name}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hourglass size={14}/> Öngörülen Süre:</span>
                  <strong style={{ color: 'var(--white)' }}>{s.duration / 60} Saat ({s.duration} dk)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tampon (Hazırlık):</span>
                  <strong style={{ color: 'var(--white)' }}>{s.buffer} dk</strong>
                </div>
              </div>
              <button 
                className={styles.actionBtn} 
                style={{ marginTop: '2rem', width: '100%' }}
                onClick={() => handleEdit(id, s)}
              >
                Yapılandır
              </button>
            </div>
          );
        })}
        
        <div 
          className={styles.statCard} 
          style={{ 
            border: '2px dashed rgba(100, 255, 218, 0.1)', 
            background: 'transparent', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            minHeight: '230px'
          }}
          onClick={handleAdd}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--accent-blue)' }}>
            <Plus size={32} />
            <span style={{ fontWeight: '600' }}>Yeni Hizmet Ekle</span>
          </div>
        </div>
      </div>

      {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '500px', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h2 style={{ fontSize: '1.5rem' }}>{editingId ? "Hizmeti Güncelle" : "Yeni Hizmet Ekle"}</h2>
                      <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X /></button>
                  </div>
                  
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className={styles.inputGroup}>
                          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>Hizmet Adı</label>
                          <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="Örn: Derin Mutfak Temizliği"
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                          />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div className={styles.inputGroup}>
                              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>İş Süresi (Dakika)</label>
                              <input 
                                type="number" 
                                value={formData.duration} 
                                onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                                required
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                              />
                              <span style={{ fontSize: '11px', color: 'var(--accent-blue)', marginTop: '5px', display: 'block' }}>~{formData.duration / 60} saat sürer.</span>
                          </div>
                          <div className={styles.inputGroup}>
                              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>Hazırlık Payı (Dakika)</label>
                              <input 
                                type="number" 
                                value={formData.buffer} 
                                onChange={e => setFormData({...formData, buffer: Number(e.target.value)})}
                                required
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                              />
                          </div>
                      </div>

                      <div className={styles.inputGroup}>
                          <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>İkon</label>
                          <select 
                            value={formData.icon} 
                            onChange={e => setFormData({...formData, icon: e.target.value})}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                          >
                              <option value="Home">Ev (Home)</option>
                              <option value="Building2">Ofis (Building)</option>
                              <option value="Layers">Çok Katlı (Layers)</option>
                              <option value="LayoutGrid">Site (Grid)</option>
                          </select>
                      </div>

                      <button type="submit" className="btn-solid" style={{ marginTop: '10px', padding: '15px' }}>
                          {editingId ? "Değişiklikleri Kaydet" : "Hizmeti Oluştur"}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </AdminLayout>
  );
}
