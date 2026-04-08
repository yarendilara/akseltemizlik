import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import "./globals.css";
import styles from "./layout.module.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

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
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
