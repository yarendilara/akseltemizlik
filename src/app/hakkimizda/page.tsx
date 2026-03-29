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
  { icon: ShieldCheck, title: 'Güven & Şeffaflık',   desc: 'Her personelimiz adli sicil ve referans kontrolünden geçer. Ev ve ofislerinize yalnızca onaylı ekipler girer.' },
  { icon: Leaf,        title: 'Çevre Dostu',          desc: 'Kullandığımız temizlik ürünleri çevre sertifikalı, aile ve evcil hayvan güvenlidir.' },
  { icon: Heart,       title: 'Müşteri Odaklılık',    desc: 'Her randevu benzersizdir. Özel taleplerinizi merkezi operasyon ekibimiz titizlikle değerlendirir.' },
  { icon: Award,       title: 'Profesyonellik',       desc: 'Düzenli eğitimler ve operasyon denetimleriyle hizmet kalitemizi sürekli yükseltiriz.' },
  { icon: Clock,       title: 'Zamanında Hizmet',     desc: 'Randevu saatlerine uyum birinci önceliğimizdir. Gecikmeler operasyon merkezimiz tarafından proaktif iletilir.' },
  { icon: MapPin,      title: 'İstanbul Uzmanlığı',   desc: 'Sadece İstanbul\'un 39 ilçesinde hizmet veriyoruz. Bölgesel deneyim = daha yüksek hizmet kalitesi.' },
];

const TEAM = [
  { name: 'Ahmet Yılmaz',   role: 'Kurucu & Operasyon Direktörü', initial: 'AY', color: '#0EA5E9' },
  { name: 'Selin Kaya',     role: 'Müşteri Deneyimi Müdürü',       initial: 'SK', color: '#06B6D4' },
  { name: 'Mehmet Demir',   role: 'Saha Operasyon Sorumlusu',      initial: 'MD', color: '#F97316' },
  { name: 'Ayşe Çelik',     role: 'Kalite Kontrol Uzmanı',         initial: 'AÇ', color: '#10B981' },
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
              2019&apos;dan bu yana İstanbul genelinde binlerce ailenin ve işletmenin
              güvendiği operasyonel temizlik merkezi. İnsanı odak noktasına aldık;
              algoritmalar değil, uzman ellerin dokunaklı kalitesini sunuyoruz.
            </p>
            <div className={styles.heroCtas}>
              <motion.a href="/rezervasyon" className="btn-primary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Hemen Randevu Al <ArrowRight size={16} />
              </motion.a>
              <motion.a href="/hizmet-veren-ol" className={styles.outlineBtn}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Ekibimize Katıl
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

      {/* ── Stats strip ── */}
      <section className={styles.statsSection}>
        <div className="container">
          <Section className={styles.statsGrid}>
            {[
              { n: '1.200+', label: 'Tamamlanan Hizmet',    icon: Sparkles },
              { n: '39',     label: 'İstanbul İlçesi',      icon: MapPin },
              { n: '%98',    label: 'Müşteri Memnuniyeti',  icon: Star },
              { n: '5+',     label: 'Yıllık Deneyim',       icon: Award },
              { n: '80+',    label: 'Aktif Uzman Personel', icon: Users },
            ].map(({ n, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className={styles.statCard}>
                <div className={styles.statIconWrap}><Icon size={20} /></div>
                <div className={styles.statNum}>{n}</div>
                <div className={styles.statLabel}>{label}</div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── Story ── */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyText}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className={styles.sectionLabel}>Hikayemiz</span>
              <h2>Küçük Bir Fikirden Büyük Bir Harekete</h2>
              <p>
                Aksel Temizlik, 2019 yılında İstanbul&apos;da yaşayan insanların güvenilir,
                şeffaf ve kaliteli bir temizlik hizmeti bulamamasındaki hayal kırıklığından
                doğdu. Kurucu ortaklarımız bu boşluğu doldurmak için yola çıktı.
              </p>
              <p>
                Bugün merkezi operasyon sistemimiz, her randevuyu tek tek yönetiyor.
                Otomatik eşleştirme yapmıyoruz — ekibimiz, hangi uzmanın sizin
                ihtiyacınıza en uygun olduğuna bizzat karar veriyor.
              </p>
              <p>
                Bu &quot;insan dokunuşu&quot; yaklaşımı bizi rakiplerimizden ayıran temel felsefemizdir.
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              className={styles.timeline}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  {i < MILESTONES.length - 1 && <div className={styles.timelineLine} />}
                  <div className={styles.timelineBody}>
                    <span className={styles.timelineYear}>{m.year}</span>
                    <h4>{m.label}</h4>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
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
              <span className={styles.sectionLabel}>Ekibimiz</span>
              <h2>Arkamızdaki İnsanlar</h2>
              <p>Operasyon merkezimizin özünü oluşturan profesyoneller.</p>
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
              <motion.a href="/hizmet-veren-ol" className={styles.ctaOutlineBtn}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Ekibimize Katıl
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
