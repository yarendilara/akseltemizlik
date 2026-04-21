"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Navigation,
  Home as HomeIcon,
  Building2,
  Layers,
  LayoutGrid,
  Star,
  CalendarCheck,
  ClipboardList,
  Sparkles,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import styles from './page.module.css';
import { ISTANBUL_DISTRICTS, SERVICE_CONFIG } from '@/lib/constants';

const IconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Layers: Layers,
  LayoutGrid: LayoutGrid,
  Sparkles: Sparkles,
};

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─── Stat item ─── */
function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className={styles.statItem}>
      <div className={styles.statNumber}>
        <span ref={ref}>{count.toLocaleString('tr')}</span>
        <span className={styles.statSuffix}>{suffix}</span>
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ─── Stagger container ─── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Home() {
  const [district, setDistrict] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [isDistOpen, setIsDistOpen] = useState(false);
  const [isServOpen, setIsServOpen] = useState(false);

  const handleQuickBooking = () => {
    const url = new URL('/rezervasyon', window.location.origin);
    if (district) url.searchParams.set('district', district);
    if (serviceId) url.searchParams.set('serviceId', serviceId);
    window.location.href = url.toString();
  };

  return (
    <main className={styles.main}>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        {/* Animated blobs */}
        <div className={styles.heroBg}>
          <div className={styles.blob} />
          <div className={styles.blob} />
          <div className={styles.blob} />
          <div className={styles.blob} />
        </div>

        {/* Floating bubbles */}
        <div className={styles.bubblesContainer}>
          {Array.from({ length: 36 }).map((_, i) => {
            const allImages = [
              '/images/cleaning_lady.png',
              '/images/foto1.jpg',
              '/images/foto2.jpg',
              '/images/foto3.jpg',
              '/images/download-1.jpg',
              '/images/download-2.jpg',
              '/images/download-3.jpg',
              '/images/download-4.jpg',
              '/images/download-5.jpg',
              '/images/download-6.jpg',
              '/images/download.jpg',
              '/images/empty_house_clean.png',
              '/images/images-1.jpg',
              '/images/images-2.jpg',
              '/images/images-3.jpg',
              '/images/images-4.jpg',
              '/images/images-5.jpg',
              '/images/images-6.jpg',
              '/images/images.jpg',
              '/images/office_cleaning.png'
            ];
            
            let backgroundImage = '';
            
            // Varied distribution: 50% have images, 50% are decorative glass bubbles
            const hasImage = (i % 2 === 0);
            if (hasImage) {
              const imgIndex = (i * 13) % allImages.length; 
              backgroundImage = `url(${allImages[imgIndex]})`;
            }

            return (
              <div 
                key={i} 
                className={`${styles.bubble} ${backgroundImage ? styles.bubbleImg : ''}`}
                style={{ backgroundImage }}
              />
            );
          })}
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={styles.heroContent}
          >
            <motion.span
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className={styles.badgeDot} />
              İstanbul Geneli Premium Temizlik
            </motion.span>

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              Yaşam Alanınıza <br />
              <span className={styles.highlight}>Pırıl Pırıl</span> <br />
              Temizlik
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              İstanbul geneli operasyon merkezi destekli, uzman ekiplerle
              ev, ofis ve site temizliğinde en yüksek standartlar.
            </motion.p>

            {/* Quick booking widget */}
            <motion.div
              className={styles.quickBooking}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
            >
              <div className={styles.bookingRow}>
                {/* District dropdown */}
                <div className={styles.inputGroup}>
                  <label>İlçe</label>
                  <div className={styles.dropdownWrapper}>
                    <div
                      className={styles.dropdownTrigger}
                      onClick={() => { setIsDistOpen(!isDistOpen); setIsServOpen(false); }}
                    >
                      {district || 'İlçe Seçiniz'}
                      <ChevronDown size={14} className={styles.chevron} style={{ opacity: 0.5 }} />
                    </div>
                    {isDistOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={styles.dropdownPanel}
                      >
                        <div className={styles.dropdownScrollArea}>
                          {ISTANBUL_DISTRICTS.map(dist => (
                            <div
                              key={dist}
                              className={`${styles.dropdownOption} ${district === dist ? styles.selected : ''}`}
                              onClick={() => { setDistrict(dist); setIsDistOpen(false); }}
                            >
                              {dist}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className={styles.divider} />

                {/* Service dropdown */}
                <div className={styles.inputGroup}>
                  <label>Hizmet</label>
                  <div className={styles.dropdownWrapper}>
                    <div
                      className={styles.dropdownTrigger}
                      onClick={() => { setIsServOpen(!isServOpen); setIsDistOpen(false); }}
                    >
                      {serviceId ? SERVICE_CONFIG[serviceId as keyof typeof SERVICE_CONFIG].name : 'Hizmet Seçiniz'}
                      <ChevronDown size={14} className={styles.chevron} style={{ opacity: 0.5 }} />
                    </div>
                    {isServOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={styles.dropdownPanel}
                      >
                        <div className={styles.dropdownScrollArea}>
                          {Object.entries(SERVICE_CONFIG).map(([id, s]) => (
                            <div
                              key={id}
                              className={`${styles.dropdownOption} ${serviceId === id ? styles.selected : ''}`}
                              onClick={() => { setServiceId(id); setIsServOpen(false); }}
                            >
                              {s.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <button className={`btn-solid ${styles.bookingSubmitBtn}`} onClick={handleQuickBooking}>
                  Müsaitlik Gör <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>



      {/* ═══ WHY US ═══ */}
      <section className={styles.whyUs}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionLabel}>Neden Biz?</span>
            <h2>Güven, Kalite, Uzmanlık</h2>
            <p>Her randevuyu operasyon ekibimiz birebir yönetir — otomasyon değil, gerçek uzmanlık.</p>
            
            <motion.div 
              className={styles.sectionVideoWrapper}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <video 
                src="/assets/zinde_video.mp4" 
                controls 
                autoPlay 
                muted 
                loop 
                playsInline
                className={styles.sectionVideo}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {[
              { Icon: ShieldCheck, title: 'Titiz İnceleme', desc: 'Hizmet verenlerimiz adli sicil kaydı ve profesyonel referansla sisteme admin tarafından eklenir.' },
              { Icon: UserCheck,  title: 'Manuel Atama',   desc: 'Randevunuz bir algoritma değil, uzman operasyon ekibimizce en uygun personele atanır.' },
              { Icon: Navigation, title: 'İstanbul Uzmanlığı', desc: 'Sadece İstanbul ilçelerinde, bölgeyi tanıyan ve deneyimli ekiplerle hizmet veriyoruz.' },
            ].map(({ Icon, title, desc }) => (
              <motion.div key={title} variants={itemVariants} className={styles.card}>
                <div className={styles.iconCircle}>
                  <Icon className={styles.lucideIcon} />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ INTERMEDIATE IMAGE ═══ */}
      <div className={styles.interImageContainer}>
        <div className="container">
          <motion.div 
            className={styles.fullWidthImage}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src="/images/foto1.jpg" alt="Zinde Temizlik Süreci" />
          </motion.div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className={styles.howItWorks}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionLabel}>Nasıl Çalışır?</span>
            <h2>3 Adımda Tertemiz Bir Ev</h2>
          </motion.div>

          <motion.div
            className={styles.stepsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { n: '1', Icon: CalendarCheck, title: 'Randevu Al', desc: 'İlçenizi ve hizmet türünüzü seçerek birkaç dakikada randevunuzu oluşturun.' },
              { n: '2', Icon: ClipboardList, title: 'Ekip Atanır', desc: 'Operasyon merkezimiz talebinizi inceler ve size en uygun uzman ekibi atar.' },
              { n: '3', Icon: Sparkles,      title: 'Tertemiz Olur', desc: 'Belirlenen saatte ekip kapınıza gelir, profesyonel ekipmanlarla hizmetinizi tamamlar.' },
            ].map(({ n, Icon, title, desc }) => (
              <motion.div key={n} variants={itemVariants} className={styles.stepItem}>
                <motion.div
                  className={styles.stepNumber}
                  whileHover={{ scale: 1.12 }}
                >
                  <Icon size={28} />
                </motion.div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className={styles.services}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionLabel}>Hizmetlerimiz</span>
            <h2>İhtiyacınıza Uygun Çözüm</h2>
          </motion.div>

          <motion.div
            className={styles.serviceSlider}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {Object.entries(SERVICE_CONFIG).map(([id, service], index) => {
              const Icon = IconMap[service.icon as keyof typeof IconMap];
              return (
                <motion.div
                  key={id}
                  variants={itemVariants}
                  className={styles.serviceCard}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={styles.cardIcon}>
                    <Icon size={28} strokeWidth={1.8} />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.duration / 60} saatlik profesyonel program</p>
                  <button className={styles.cardBtn} onClick={() => window.location.href = '/rezervasyon'}>
                    Randevu Al
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className={styles.faq}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.sectionLabel}>SSS</span>
            <h2>Sık Sorulan Sorular</h2>
          </motion.div>

          <motion.div
            className={styles.faqList}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                q: 'Ödeme nasıl tahsil ediliyor?',
                a: 'Platform üzerinden online ödeme veya finansal işlem yapılmamaktadır. Hizmet sonrasında operasyon sorumlumuz (+90 546 595 92 80) ile iletişime geçilir.',
              },
              {
                q: 'Hizmet verenler kim?',
                a: 'Zinde sistemine sadece başvurusu onaylanan, adli sicil ve referans kontrolünden geçen uzmanlar dahil olabilir.',
              },
              {
                q: 'Hangi ilçelerde hizmet veriyorsunuz?',
                a: 'İstanbul\'un 39 ilçesinin tamamında aktif olarak hizmet vermekteyiz.',
              },
              {
                q: 'Randevumu nasıl iptal edebilirim?',
                a: 'Randevu iptali veya saat değişikliği işlemleri için WhatsApp destek hattımız (+90 546 595 92 80) üzerinden randevu numaranızla birlikte bizimle iletişime geçebilirsiniz.',
              },
            ].map(({ q, a }) => (
              <motion.div key={q} variants={itemVariants} className={styles.faqItem}>
                <h5>
                  <HelpCircle size={18} className={styles.faqIcon} />
                  {q}
                </h5>
                <p>{a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ RECRUITMENT SECTION ═══ */}
      <section className={styles.recruitment}>
        <div className="container">
          <motion.div
            className={styles.recruitmentCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.recruitmentContent}>
              <span className={styles.sectionLabel}>Kariyer</span>
              <h2>Bizimle Çalışmak İster Misiniz?</h2>
              <p>Zinde Temizlik ailesinin bir parçası olun. Uzman ekiplerimize katılın, profesyonel bir ortamda birlikte büyüyelim.</p>
              <motion.a
                href="/calisan-basvurusu"
                className="btn-solid"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}
              >
                Hemen Başvur <UserCheck size={18} />
              </motion.a>
            </div>
            <div className={styles.recruitmentImg}>
              <img src="/assets/bize.png" alt="Bizimle Çalışın" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaContentWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.ctaImgSide}>
              <img src="/images/foto2.jpg" alt="Temizlik Başlangıcı" />
            </div>
            <div className={styles.ctaInner}>
              <h2>Temiz Bir Başlangıç Sadece 1 Tık Uzakta</h2>
              <p>Hemen randevu alın, uzman ekibimiz kapınıza gelsin. İstanbul&apos;un her köşesinde hizmetinizdeyiz.</p>
              <div className={styles.ctaBtns}>
                <motion.a
                  href="/rezervasyon"
                  className="btn-primary"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Hemen Randevu Al <ArrowRight size={18} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
