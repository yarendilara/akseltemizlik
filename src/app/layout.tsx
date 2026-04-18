import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import "./globals.css";
import styles from "./layout.module.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Zinde Temizlik | Profesyonel İstanbul Ev ve Ofis Temizliği",
  description: "İstanbul'un 39 ilçesinde uzman kadromuzla yanınızdayız. Ev temizliği, ofis temizliği, inşaat sonrası ve boş ev temizliği hizmetleri. Hemen randevu alın, yaşam alanınızı parlatın!",
  keywords: ["zinde temizlik", "istanbul temizlik", "ev temizliği", "ofis temizliği", "inşaat sonrası temizlik", "istanbul temizlik şirketi"],
  alternates: {
    canonical: 'https://zindetemizlik.com',
  },
  openGraph: {
    title: "Zinde Temizlik | İstanbul Operasyonel Hizmet Platformu",
    description: "İstanbul geneli premium temizlik operasyon merkezi.",
    url: 'https://zindetemizlik.com',
    siteName: 'Zinde Temizlik',
    locale: 'tr_TR',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Zinde Temizlik",
  "image": "https://zindetemizlik.com/images/foto1.jpg",
  "@id": "https://zindetemizlik.com",
  "url": "https://zindetemizlik.com",
  "telephone": "+905465959280",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "İstanbul Geneli",
    "addressLocality": "İstanbul",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.0082,
    "longitude": 28.9784
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
