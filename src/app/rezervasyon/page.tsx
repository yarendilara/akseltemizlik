"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  MapPin, 
  Bell, 
  AlertTriangle, 
  CheckCircle2,
  Home,
  Building2,
  Layers,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import styles from './page.module.css';
import { ISTANBUL_DISTRICTS, SERVICE_CONFIG, BOOKING_STATES } from '@/lib/constants';
import { BookingService } from '@/lib/booking-service';

type BookingData = {
  serviceId: keyof typeof SERVICE_CONFIG;
  district: string;
  address: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const IconMap = {
  Home,
  Building2,
  Layers,
  LayoutGrid
};

function BookingFlowContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<BookingData>>({});
  const [isDistOpen, setIsDistOpen] = useState(false);
  
  // Calendar States
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (d: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    updateData({ date: selected.toISOString().split('T')[0], time: undefined });
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const updateData = (fields: Partial<BookingData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const currentSlots = data.date && data.serviceId 
    ? BookingService.getAvailableSlots(data.date, data.district || '', data.serviceId) 
    : [];

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = (getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) + 6) % 7; // Monday start
  const monthName = viewDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
  const dayLabels = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

  // Initialize from search params
  useEffect(() => {
    const d = searchParams.get('district');
    const s = searchParams.get('serviceId');
    const update: Partial<BookingData> = {};
    
    if (d && ISTANBUL_DISTRICTS.includes(d)) {
      update.district = d;
    }
    if (s && s in SERVICE_CONFIG) {
      update.serviceId = s as keyof typeof SERVICE_CONFIG;
    }

    if (Object.keys(update).length > 0) {
      setData(prev => ({ ...prev, ...update }));
      if (update.district && update.serviceId) {
        setStep(2);
      }
    }
  }, [searchParams]);

  const handleFinalSubmit = () => {
    const bookingId = `AKSEL-${Math.floor(Math.random() * 900000) + 100000}`;
    const myBookings = JSON.parse(localStorage.getItem('aksel_bookings') || '[]');
    
    myBookings.push({
      id: bookingId,
      date: data.date,
      time: data.time,
      service: data.serviceId ? SERVICE_CONFIG[data.serviceId].name : '',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('aksel_bookings', JSON.stringify(myBookings));

    const adminBookings = JSON.parse(localStorage.getItem('aksel_mock_bookings') || '[]');
    adminBookings.push({
      id: bookingId,
      customer: data.name || "Bilinmiyor",
      district: data.district || "Bilinmiyor",
      service: data.serviceId ? SERVICE_CONFIG[data.serviceId].name : 'Belirtilmedi',
      date: `${data.date} ${data.time}`,
      status: 'SUBMITTED',
      cleanerId: null
    });
    localStorage.setItem('aksel_mock_bookings', JSON.stringify(adminBookings));

    setData(prev => ({ ...prev, name: bookingId }));
    setStep(6);
  };

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.bookingCard}>
          <div className={styles.progress}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`${styles.dot} ${step >= s ? styles.done : ''} ${step === s ? styles.current : ''}`} />
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                switch (step) {
                  case 1:
                    return (
                      <div className={styles.stepContent}>
                        <h2>Hizmet ve Bölge Seçimi</h2>
                        <div className={styles.serviceGrid}>
                          {Object.entries(SERVICE_CONFIG).map(([id, service]) => {
                            const Icon = IconMap[service.icon as keyof typeof IconMap];
                            return (
                              <div 
                                key={id} 
                                className={`${styles.selectCard} ${data.serviceId === id ? styles.active : ''}`}
                                onClick={() => updateData({ serviceId: id as keyof typeof SERVICE_CONFIG })}
                              >
                                <span className={styles.icon}>
                                  <Icon strokeWidth={1.5} size={32} />
                                </span>
                                <h3>{service.name}</h3>
                                <p>Süre: {service.duration / 60} Saat (+{service.buffer}dk Hazırlık)</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.inputGroup}>
                          <label>İstanbul'da Hizmet Alacak İlçe</label>
                          <div className={styles.dropdownWrapper}>
                            <div 
                              className={styles.dropdownTrigger} 
                              onClick={() => setIsDistOpen(!isDistOpen)}
                            >
                              {data.district || "İlçe Seçiniz"}
                              <ChevronDown size={14} style={{ opacity: 0.5 }} />
                            </div>
                            {isDistOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.dropdownPanel}
                              >
                                <div className={styles.dropdownScrollArea}>
                                  {ISTANBUL_DISTRICTS.map(d => (
                                    <div 
                                      key={d} 
                                      className={`${styles.dropdownOption} ${data.district === d ? styles.selected : ''}`}
                                      onClick={() => { updateData({ district: d }); setIsDistOpen(false); }}
                                    >
                                      {d}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <button className="btn-solid" disabled={!data.serviceId || !data.district} onClick={nextStep}>
                          Devam Et
                        </button>
                      </div>
                    );
                  case 2:
                    return (
                      <div className={styles.stepContent}>
                        <h2>Detaylı Operasyonel Adres</h2>
                        <div className={styles.inputGroup}>
                          <label>Hizmet Verilecek Detaylı Adres</label>
                          <textarea 
                            rows={5} 
                            placeholder="Örn: Barbaros Mah. Karanfil Sk. No:12 Daire:4 Kat:2 (Lütfen tam adresi detaylı girdiğinizden emin olun)"
                            value={data.address || ''}
                            onChange={(e) => updateData({ address: e.target.value })}
                            className={styles.elegantTextarea}
                          />
                          <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <MapPin size={14} /> Temizlik hizmeti için açık adres gereklidir.
                          </div>
                        </div>

                        <div className={styles.inputGroup}>
                          <label>Ek Notlar & Giriş Detayları</label>
                          <textarea 
                            rows={2} 
                            placeholder="Evcil hayvan, güvenlik girişi kodu, zil detayı vb..."
                            value={data.notes || ''}
                            onChange={(e) => updateData({ notes: e.target.value })}
                          />
                        </div>
                        <div className={styles.stepActions}>
                          <button className={styles.backBtn} onClick={prevStep}>Geri</button>
                          <button className="btn-solid" disabled={!data.address} onClick={nextStep}>Tarih/Saat Seçimine Geç</button>
                        </div>
                      </div>
                    );
                  case 3:
                    return (
                      <div className={styles.stepContent}>
                        <h2>İş Takvimi ve Slotlar</h2>
                        <div className={styles.calendarContainer}>
                          <div className={styles.calendarHeader}>
                            <button onClick={prevMonth} disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}>
                              <ChevronLeft size={20} />
                            </button>
                            <h3>{monthName}</h3>
                            <button onClick={nextMonth}>
                              <ChevronRight size={20} />
                            </button>
                          </div>

                          <div className={styles.calendarGrid}>
                            {dayLabels.map(label => (
                              <div key={label} className={styles.dayLabel}>{label}</div>
                            ))}
                            {Array.from({ length: firstDay }).map((_, i) => (
                              <div key={`empty-${i}`} className={styles.dayEmpty} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const dayNum = i + 1;
                              const currentDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
                              const isToday = currentDay.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                              const isPast = currentDay < today;
                              const isSelected = data.date === currentDay.toISOString().split('T')[0];

                              return (
                                <button
                                  key={dayNum}
                                  disabled={isPast}
                                  className={`${styles.dayBtn} ${isSelected ? styles.activeDay : ''} ${isToday ? styles.today : ''}`}
                                  onClick={() => handleDateSelect(dayNum)}
                                >
                                  {dayNum}
                                </button>
                              );
                            })}
                          </div>

                          {data.date && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className={styles.timeSection}
                            >
                              <div className={styles.sectionDivider}>
                                <span>Seçilen Tarih İçin Müsait Slotlar</span>
                              </div>
                              <div className={styles.slotGrid}>
                                {currentSlots.length > 0 ? currentSlots.map(slot => (
                                  <button 
                                    key={slot.startTime}
                                    className={`${styles.slotBtn} ${data.time === slot.startTime ? styles.active : ''}`}
                                    onClick={() => updateData({ time: slot.startTime })}
                                    disabled={!slot.isAvailable}
                                  >
                                    {slot.startTime}
                                  </button>
                                )) : (
                                  <p className={styles.noSlot}>Bu tarihte müsait operasyonel kapasite bulunmamaktadır.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <div className={styles.stepActions}>
                          <button className={styles.backBtn} onClick={prevStep}>Geri</button>
                          <button className="btn-solid" disabled={!data.date || !data.time} onClick={nextStep}>Müşteri Bilgileri</button>
                        </div>
                      </div>
                    );
                  case 4:
                    return (
                      <div className={styles.stepContent}>
                        <h2>Müşteri Bilgileri</h2>
                        <div className={styles.formGrid}>
                          <div className={styles.inputGroup}>
                            <label>Ad Soyad</label>
                            <input 
                              type="text" 
                              value={data.name || ''}
                              onChange={(e) => updateData({ name: e.target.value })}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Telefon</label>
                            <input 
                              type="tel" 
                              value={data.phone || ''}
                              onChange={(e) => updateData({ phone: e.target.value })}
                            />
                          </div>
                          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>E-posta</label>
                            <input 
                              type="email" 
                              value={data.email || ''}
                              onChange={(e) => updateData({ email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className={styles.stepActions}>
                          <button className={styles.backBtn} onClick={prevStep}>Geri</button>
                          <button className="btn-solid" disabled={!data.name || !data.phone || !data.email} onClick={nextStep}>Özeti İncele</button>
                        </div>
                      </div>
                    );
                  case 5:
                    return (
                      <div className={styles.stepContent}>
                        <h2>Operasyonel Rezervasyon Özeti</h2>
                        <div className={styles.summaryBox}>
                          <div className={styles.summaryItem}>
                            <span>Operasyon Durumu:</span>
                            <strong style={{ color: BOOKING_STATES.SUBMITTED.color }}>{BOOKING_STATES.SUBMITTED.label}</strong>
                          </div>
                          <div className={styles.summaryItem}>
                            <span>Hizmet Türü:</span>
                            <strong>{data.serviceId && SERVICE_CONFIG[data.serviceId].name}</strong>
                          </div>
                          <div className={styles.summaryItem}>
                            <span>Planlanan Zaman:</span>
                            <strong>{data.date} @ {data.time}</strong>
                          </div>
                          <div className={styles.summaryItem}>
                            <span>Bölge:</span>
                            <strong>{data.district} / İstanbul</strong>
                          </div>
                          <div className={styles.summaryItem}>
                            <span>Adres:</span>
                            <p>{data.address}</p>
                          </div>
                          <div className={styles.summaryItem}>
                            <span>Müşteri:</span>
                            <strong>{data.name}</strong>
                          </div>
                          <div className={styles.operationNote}>
                            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                              <Bell size={18} className={styles.accentIcon} />
                              <p>Bu randevu talebi operasyon merkezine iletilecek ve uygun personel ataması manuel olarak yapılacaktır.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                              <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                              <p>Platform üzerinden online ödeme veya herhangi bir finansal işlem yapılamaz.</p>
                            </div>
                          </div>
                        </div>
                        <div className={styles.stepActions}>
                          <button className={styles.backBtn} onClick={prevStep}>Geri</button>
                          <button className="btn-solid" onClick={handleFinalSubmit}>Randevu Talebini Gönder</button>
                        </div>
                      </div>
                    );
                  case 6:
                    return (
                      <div className={styles.successScreen}>
                        <div className={styles.successIcon}>
                          <CheckCircle2 size={72} strokeWidth={1.2} />
                        </div>
                        <h2>Randevu Talebiniz İletildi!</h2>
                        <p>Talep No: <strong>{data.name}</strong></p>
                        <p>Admin onayından sonra size SMS/E-posta ile bilgilendirme yapılacaktır.</p>
                        <button className="btn-solid" onClick={() => window.location.href = '/'}>Ana Sayfaya Dön</button>
                      </div>
                    )
                  default:
                    return null;
                }
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function BookingFlow() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: '15vh', color: 'var(--text-secondary)' }}>Yükleniyor...</div>}>
      <BookingFlowContent />
    </Suspense>
  );
}
