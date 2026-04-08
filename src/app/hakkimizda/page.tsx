"use client";

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  MapPin,
  Sparkles,
  Heart,
  Leaf,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react';
import styles from './page.module.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className={className}>
      {children}
    </motion.div>
  );
}

const VALUES = [
  { icon: ShieldCheck, title: 'Güven & Şeffaflık',   desc: 'Hizmetimizin her aşamasında dürüstlük ve profesyonellik esas alınır. Beklentilerinizi tam karşılayan, güvenilir bir deneyim sunuyoruz.' },
  { icon: Leaf,        title: 'Çevre Dostu',          desc: 'Kullandığımız temizlik ürünleri çevre sertifikalı, aile ve evcil hayvan güvenlidir.' },
  { icon: Heart,       title: 'Müşteri Odaklılık',    desc: 'Her randevu benzersizdir. Özel taleplerinizi merkezi operasyon ekibimiz titizlikle değerlendirir.' },
  { icon: Award,       title: 'Profesyonellik',       desc: 'Düzenli eğitimler ve operasyon denetimleriyle hizmet kalitemizi sürekli yükseltiriz.' },
  { icon: Clock,       title: 'Zamanında Hizmet',     desc: 'Randevu saatlerine uyum birinci önceliğimizdir. Gecikmeler operasyon merkezimiz tarafından proaktif iletilir.' },
  { icon: MapPin,      title: 'İstanbul Uzmanlığı',   desc: 'Sadece İstanbul\'un 39 ilçesinde hizmet veriyoruz. Bölgesel deneyim = daha yüksek hizmet kalitesi.' },
];

const TEAM = [
  { name: 'Ayselto', role: 'İşletme Kurucusu', initial: 'A', color: '#F97316' },
];

const MILESTONES = [
  { year: '2019', label: 'Kuruluş',               desc: 'İstanbul Kadıköy\'de 3 kişilik ekiple temeller atıldı.' },
  { year: '2020', label: 'Operasyon Merkezi',      desc: 'Merkezi atama sistemi ve ilk dijital randevu altyapısı kuruldu.' },
  { year: '2022', label: '39 İlçe',               desc: 'İstanbul\'un tüm ilçelerinde aktif hizmet kapsamına ulaşıldı.' },
  { year: '2024', label: '1.200+ Hizmet',         desc: 'Bin iki yüzü aşan başarıyla tamamlanan hizmet ve %98 memnuniyet oranı.' },
];

export default function HakkimizdaPage() {
  return (
    <main className={styles.main}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroDecor1} />
        <div className={styles.heroDecor2} />
        
        {/* Floating Image Bubbles */}
        <div className={styles.heroImgBubble1} style={{ backgroundImage: 'url(/images/cleaning_lady.png)' }} />
        <div className={styles.heroImgBubble2} style={{ backgroundImage: 'url(/images/office_cleaning.png)' }} />
        <div className={styles.heroImgBubble3} style={{ backgroundImage: 'url(/images/empty_house_clean.png)' }} />
        <div className={styles.heroImgBubble4} style={{ backgroundImage: 'url(/images/images-1.jpg)' }} />
        <div className={styles.heroImgBubble5} style={{ backgroundImage: 'url(/images/download-1.jpg)' }} />
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}>
              <Sparkles size={14} /> İstanbul&apos;un Güvenilir Temizlik Partneri
            </motion.span>
            <h1>
              Temizliği Bir <span className={styles.heroHighlight}>Sanata</span> Dönüştürüyoruz
            </h1>
            <p>
              İstanbul genelinde güvenilir, şeffaf ve profesyonel temizlik hizmetleri sunuyoruz. 
              İnsanı odak noktasına aldık; algoritmalar değil, uzman ellerin titiz dokunuşlarıyla 
              yaşam alanlarınızı parlatıyoruz.
            </p>
            <div className={styles.heroCtas}>
              <motion.a href="/rezervasyon" className="btn-primary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Hemen Randevu Al <ArrowRight size={16} />
              </motion.a>
            </div>
          </motion.div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" fill="var(--bg-white)" />
          </svg>
        </div>
      </section>

      {/* ── Story ── */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyText}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
            >
              <span className={styles.sectionLabel}>Misyonumuz</span>
              <h2>Güvenilir ve Kaliteli Temizlik</h2>
              <p>
                Aksel Temizlik, İstanbul&apos;da yaşayan insanların güvenilir, şeffaf ve 
                gerçekten kaliteli bir temizlik hizmeti alabilmesi amacıyla kuruldu. 
                Sektördeki boşluğu, insan odaklı hizmet anlayışımızla dolduruyoruz.
              </p>
              <p>
                Merkezi operasyon sistemimizle her randevuyu tek tek yönetiyor, sizin için 
                en doğru uzman ekibi bizzat belirliyoruz. Otomatik süreçlerin ötesinde, 
                gerçek bir &quot;insan dokunuşu&quot; sunuyoruz.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Değerlerimiz</span>
              <h2>Bizi Biz Yapan İlkeler</h2>
              <p>Her temizlik hizmetinin arkasında bu değerler yatmaktadır.</p>
            </motion.div>
            <div className={styles.valuesGrid}>
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={fadeUp} className={styles.valueCard}>
                  <div className={styles.valueIcon}><Icon size={26} /></div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.teamSection}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Kurucumuz</span>
              <h2>Hizmetin Arkasındaki İsim</h2>
              <p>Operasyon merkezimizin vizyonunu belirleyen liderimiz.</p>
            </motion.div>
            <div className={styles.teamGrid}>
              {TEAM.map(({ name, role, initial, color }) => (
                <motion.div key={name} variants={fadeUp} className={styles.teamCard}
                  whileHover={{ y: -6 }}>
                  <div className={styles.avatar} style={{ background: `${color}20`, color }}>
                    {initial}
                  </div>
                  <h4>{name}</h4>
                  <p>{role}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaInner}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Siz de Aksel Ailesinin Bir Parçası Olun</h2>
            <p>İlk randevunuzu şimdi alın, farkı kendiniz hissedin.</p>
            <div className={styles.ctaBtns}>
              <motion.a href="/rezervasyon" className="btn-primary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Randevu Al <ArrowRight size={16} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
