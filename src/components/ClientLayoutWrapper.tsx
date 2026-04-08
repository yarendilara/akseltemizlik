"use client";

import { usePathname } from 'next/navigation';
import { MessageCircle } from "lucide-react";
import styles from "@/app/layout.module.css";
import Navbar from "@/components/Navbar";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/905000000000" 
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
                AKSEL<span className={styles.logoHighlight}>TEMİZLİK</span>
              </div>
              <p>İstanbul'un güven veren operasyonel temizlik merkezi.</p>
            </div>
            <div className={styles.footerLinks}>
              <h6>Hizmetler</h6>
              <a href="#">Boş Ev Temizliği</a>
              <a href="#">Ofis Temizliği</a>
              <a href="#">İnşaat Sonrası</a>
            </div>
            <div className={styles.footerLinks}>
              <h6>Kurumsal</h6>
              <a href="/hakkimizda">Hakkımızda</a>
              <a href="/randevularim">Randevularım</a>
              <a href="#">Süreç Hakkında</a>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>© {new Date().getFullYear()} Aksel Temizlik. Operasyonel Otomasyon v1.0.</p>
            <p>📍 Sadece İstanbul İlçelerinde Hizmet Vermekteyiz.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
