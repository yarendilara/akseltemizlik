"use client";

import { usePathname } from 'next/navigation';
import { MessageCircle } from "lucide-react";
import styles from "@/app/layout.module.css";
import Navbar from "@/components/Navbar";
import SplashLoader from "@/components/SplashLoader";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <SplashLoader />
      <Navbar />
      {children}
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/905465959280" 
        className="whatsappFloat" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geçin"
      >
        <MessageCircle size={32} />
      </a>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                ZİNDE<span className={styles.logoHighlight}>TEMİZLİK</span>
              </div>
              <p>İstanbul'un güven veren operasyonel temizlik merkezi.</p>
              <div className={styles.footerContact}>
                <p>📞 +90 546 595 92 80</p>
                <p>💬 WhatsApp Destek Hattı</p>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <h6>Hizmetler</h6>
              <a href="/rezervasyon">Site ve Sosyal Alan</a>
              <a href="/rezervasyon">İş Yeri Ofis Temizliği</a>
              <a href="/rezervasyon">İnşaat Sonrası</a>
              <a href="/rezervasyon">Boş Ev Temizliği</a>
              <a href="/rezervasyon">Apartman Temizliği</a>
              <a href="/rezervasyon">Merdiven Temizliği</a>
            </div>
            <div className={styles.footerLinks}>
              <h6>Kurumsal</h6>
              <a href="/hakkimizda">Hakkımızda</a>
              <a href="/randevularim">Randevularım</a>
              <a href="#">KVKK Aydınlatma Metni</a>
              <a href="#">Gizlilik Politikası</a>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>© {new Date().getFullYear()} Zinde Temizlik. Operasyonel Otomasyon v1.0.</p>
            <p>📍 Sadece İstanbul İlçelerinde Hizmet Vermekteyiz.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
