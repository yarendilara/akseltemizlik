"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileEdit, 
  Search, 
  UserPlus, 
  Lock, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';
import styles from './page.module.css';
import { ISTANBUL_DISTRICTS, SERVICE_CONFIG } from '@/lib/constants';
import { addApplication } from '@/lib/mock-db';

export default function BecomeCleaner() {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', surname: '', tckn: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const toggleDistrict = (dist: string) => {
    setSelectedDistricts(prev => 
      prev.includes(dist) ? prev.filter(d => d !== dist) : [...prev, dist]
    );
  };

  const selectAll = () => {
    if (selectedDistricts.length === ISTANBUL_DISTRICTS.length) {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts([...ISTANBUL_DISTRICTS]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDistricts.length === 0) {
      alert("Lütfen çalışmak istediğiniz en az bir ilçe seçin.");
      return;
    }
    
    addApplication({
      name: `${formData.name} ${formData.surname}`,
      tckn: formData.tckn,
      phone: formData.phone,
      email: formData.email,
      districts: selectedDistricts
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-accent)', borderRadius: '12px' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 20px auto' }} />
          <h2 style={{ marginBottom: '10px' }}>Başvurunuz Alındı!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Belgeleriniz ve operasyonel formunuz sistemimize ulaştı.<br/>
            Admin onayından sonra belirttiğiniz <strong>{formData.email}</strong> adresine aktivasyon bilgileri gönderilecektir.
          </p>
          <button className="btn-solid" onClick={() => window.location.href = '/'} style={{ marginTop: '20px' }}>
             Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.intro}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.header}
          >
            <span className={styles.badge}>Başvuru Süreci</span>
            <h1>Aksel Ailesine Katılın</h1>
            <p>
              Operasyon ekibimizde yer almak için sadece form doldurarak başvurunuzu yapabilirsiniz. 
              Hesabınız sadece admin onayından sonra oluşturulacaktır.
            </p>
          </motion.div>
          
          <div className={styles.processGrid}>
            <motion.div 
              whileHover={{ y: -5 }}
              className={styles.processCard}
            >
              <div className={styles.iconCircle}>
                <FileEdit size={24} strokeWidth={1.5} />
              </div>
              <h3>Başvur</h3>
              <p>Hassas verilerinizi içeren formu doldurun.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className={styles.processCard}
            >
              <div className={styles.iconCircle}>
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <h3>Operasyonel Kontrol</h3>
              <p>T.C. No ve belgelerin admin tarafından doğrulanması.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className={styles.processCard}
            >
              <div className={styles.iconCircle}>
                <UserPlus size={24} strokeWidth={1.5} />
              </div>
              <h3>Hesap Oluşturma</h3>
              <p>Sadece onaylanan adaylara admin hesabı açılır.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Başvuru Formunu Doldur</h2>
              <div className={styles.securityWarning}>
                <Lock size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                <span>Verileriniz KVKK standartlarında, şifreli ve admin-only erişimle korunmaktadır.</span>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Adınız</label>
                  <input type="text" placeholder="Adınız" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Soyadınız</label>
                  <input type="text" placeholder="Soyadınız" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>E-Posta Adresi</label>
                  <input type="email" placeholder="ornek@mail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>T.C. Kimlik Numarası (Hassas Veri)</label>
                  <input type="text" maxLength={11} placeholder="11 haneli T.C. No" value={formData.tckn} onChange={e => setFormData({...formData, tckn: e.target.value})} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Telefon Numarası</label>
                  <input type="tel" placeholder="05XX-XXX-XX-XX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
                
                <div className={styles.fullWidth}>
                  <div className={styles.flexHeader}>
                    <label>Çalışılacak İlçeler</label>
                    <button type="button" onClick={selectAll} className={styles.selectAllBtn}>
                      {selectedDistricts.length === ISTANBUL_DISTRICTS.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                    </button>
                  </div>
                  <div className={styles.checkboxGrid}>
                    {ISTANBUL_DISTRICTS.map(dist => (
                      <label key={dist} className={`${styles.checkLabel} ${selectedDistricts.includes(dist) ? styles.activeCheck : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={selectedDistricts.includes(dist)}
                          onChange={() => toggleDistrict(dist)}
                        /> 
                        {dist}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.fullWidth}>
                  <div className={styles.fileUpload}>
                    <label>Adli Sicil Kaydı (E-Devlet PDF)</label>
                    <div className={styles.uploadBox}>
                      <span>Secure PDF Upload</span>
                      <input type="file" accept=".pdf" />
                    </div>
                  </div>
                </div>

                <div className={styles.finalAgreement}>
                  <label>
                    <input type="checkbox" required />
                    <span>Hizmet verenlerin sisteme kendi kendilerine kayıt olamayacağını, bu formun sadece bir başvuru olduğunu anladım.</span>
                  </label>
                </div>

                <div className={styles.fullWidth}>
                  <button type="submit" className="btn-solid" style={{ width: '100%', padding: '1.2rem' }}>
                    Operasyonel Başvuruyu Gönder
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
