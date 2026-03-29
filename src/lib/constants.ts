/**
 * Aksel Temizlik - Merkezi Operasyonel Sabitler
 */

export const ISTANBUL_DISTRICTS = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar",
  "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş",
  "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca",
  "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih",
  "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal",
  "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
  "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli",
  "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"
];

export const SERVICE_CONFIG = {
  "bos-ev": {
    name: "Boş Ev Temizliği",
    duration: 240, // Dakika (4 saat)
    buffer: 60,    // Dakika (1 saat hazırlık/yol)
    icon: "Home"
  },
  "ofis": {
    name: "Ofis Temizliği",
    duration: 180, // Dakika (3 saat)
    buffer: 30,    // Dakika
    icon: "Building2"
  },
  "merdiven": {
    name: "Merdiven Temizliği",
    duration: 120, // Dakika (2 saat)
    buffer: 30,    // Dakika
    icon: "Layers"
  },
  "site": {
    name: "Site Temizliği",
    duration: 480, // Dakika (8 saat - Tam gün)
    buffer: 60,    // Dakika
    icon: "LayoutGrid"
  }
};

export type BookingStatus = 
  | "DRAFT" 
  | "SUBMITTED" 
  | "PENDING_REVIEW" 
  | "AWAITING_ASSIGNMENT" 
  | "ASSIGNED" 
  | "CONFIRMED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELED" 
  | "RESCHEDULED";

export const BOOKING_STATES: Record<BookingStatus, { label: string, color: string }> = {
  DRAFT: { label: "Taslak", color: "#8892B0" },
  SUBMITTED: { label: "İletildi", color: "#64FFDA" },
  PENDING_REVIEW: { label: "İncelemede", color: "#F1C40F" },
  AWAITING_ASSIGNMENT: { label: "Atama Bekliyor", color: "#D4AF37" },
  ASSIGNED: { label: "Atandı", color: "#3498DB" },
  CONFIRMED: { label: "Onaylandı", color: "#2ECC71" },
  IN_PROGRESS: { label: "Devam Ediyor", color: "#E67E22" },
  COMPLETED: { label: "Tamamlandı", color: "#27AE60" },
  CANCELED: { label: "İptal Edildi", color: "#E74C3C" },
  RESCHEDULED: { label: "Yeniden Planlandı", color: "#9B59B6" }
};
