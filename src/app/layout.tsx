import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Aksel Temizlik | İstanbul Operasyonel Hizmet Platformu",
  description: "İstanbul geneli premium temizlik operasyon merkezi. Uzman kadro ve merkezi planlama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        {children}
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
                <a href="#">Boş Ev</a>
                <a href="#">Ofis</a>
                <a href="#">Dış Cephe</a>
              </div>
              <div className={styles.footerLinks}>
                <h6>Başvuru</h6>
                <a href="/hizmet-veren-ol">Hizmet Veren Ol</a>
                <a href="#">Süreç Hakkında</a>
              </div>
            </div>
            <div className={styles.copyright}>
              <p>© {new Date().getFullYear()} Aksel Temizlik. Operasyonel Otomasyon v1.0.</p>
              <p>📍 Sadece İstanbul İlçelerinde Hizmet Vermekteyiz.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
