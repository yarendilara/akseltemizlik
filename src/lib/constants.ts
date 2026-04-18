/**
 * Zinde Temizlik - Merkezi Operasyonel Sabitler
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
  "site-sosyal": {
    name: "Site ve Sosyal Alan Temizliği",
    duration: 480, // 8 saat
    buffer: 60,
    icon: "LayoutGrid"
  },
  "is-yeri-ofis": {
    name: "İş Yeri Ofis Temizliği",
    duration: 180, // 3 saat
    buffer: 30,
    icon: "Building2"
  },
  "insaat-sonrasi": {
    name: "İnşaat Sonrası Temizlik",
    duration: 360, // 6 saat
    buffer: 60,
    icon: "Sparkles"
  },
  "bos-ev": {
    name: "Boş Ev Temizliği",
    duration: 240, // 4 saat
    buffer: 60,
    icon: "Home"
  },
  "apartman": {
    name: "Apartman Temizliği",
    duration: 180,
    buffer: 30,
    icon: "Layers"
  },
  "merdiven": {
    name: "Merdiven Temizliği",
    duration: 120,
    buffer: 30,
    icon: "Layers"
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
