# Aksel Temizlik - Nihai Operasyonel Mimari ve Sistem Tasarımı

Bu doküman, Aksel Temizlik platformunun teknik altyapısını, güvenlik standartlarını ve operasyonel iş kurallarını tanımlayan nihai mimari plandır.

---

## 1. Düzeltilmiş Ürün Özeti (Final Corrected Product Summary)
Aksel Temizlik; İstanbul'un 39 ilçesinde faaliyet gösteren, yüksek güvenlik ve kalite standartlarına sahip bir **temizlik operasyon yönetim sistemidir.** Sistem, bağımsız çalışanların kontrolsüz eşleştiği bir pazar yeri değil; her personelin adli sicil kontrolünden geçtiği, eğitildiği ve iş atamalarının profesyonel operasyon merkezi tarafından manuel olarak yönetildiği bir **ajans otomasyonu** modelidir. Platformda hiçbir şekilde finansal işlem (ödeme/tahsilat) yapılmaz; tüm odak randevu sadakati, personel güvenliği ve takvim verimliliğidir.

---

## 2. Operasyonel Mimari (Operational Architecture)
Sistem, "Single Source of Truth" (SSoT) olarak **Admin Master Takvimi** etrafında şekillenir.
- **Merkezi Kontrol:** Müşteri talepleri doğrudan "Atanmış" duruma geçmez; önce operasyonel incelemeye (Pending Review) girer.
- **Personel Havuzu:** Temizlikçiler sisteme kendileri kayıt olamaz; admin onayıyla profil oluşturulur.
- **İletişim:** Tüm durum değişiklikleri asenkron bildirim servisleri (SMS/E-posta) üzerinden taraflara iletilir.

---

## 3. Admin Master Takvim Kuralları (Admin Master Calendar Rules)
Admin takvimi, sistemin en yetkili karar vericisidir:
- **Inputlar:** Temizlikçilerin beyan ettiği haftalık/günlük müsaitlikler sisteme "öneri" olarak girer.
- **Manuel Blok:** Admin, belirli tarih veya saatleri (resmi tatiller, ekip toplantıları vb.) global veya bölge bazlı bloke edebilir.
- **Override Yetkisi:** Müşteri ekranında "Dolu" görünen bir slot, admin tarafından manuel olarak "Açık" hale getirilebilir veya dolu bir slot personelden geri alınıp boşa çıkarılabilir.
- **Çakışma Önleme:** Personelin mevcut işi + hizmet süresi + buffer süresi bitmeden yeni iş atamasına izin verilmez.
- **Slot Serbest Bırakma:** İptal edilen randevuların slotları, admin onayıyla veya otomatik kurallarla (iptal süresi uygunsa) tekrar havuza döner.

---

## 4. Rezervasyon Motoru Kuralları (Booking Engine Rules)
- **Hizmet Süreleri:** 
    - Boş Ev: 240dk (4sa)
    - Ofis: 180dk (3sa)
    - Merdiven: 120dk (2sa)
    - Site: 480dk (8sa)
- **Buffer Süresi:** Her işin sonuna 60 dakikalık "Seyahat ve Hazırlık" süresi zorunlu olarak eklenir.
- **Minimum Bildirim:** En erken 24 saat sonrası için randevu alınabilir (Admin bu kuralı bypass edebilir).
- **Seyahat Uyumluluğu:** Aynı gün içinde iki iş arası mesafe, İstanbul trafik yoğunluğu ve ilçe sınırları baz alınarak admin tarafından kontrol edilir.
- **Geçici Rezervasyon (Hold):** Müşteri form doldururken seçtiği slot 15 dakika boyunca "Hold" durumunda kalır.

---

## 5. Rezervasyon Durum Makinesi (Booking State Machine Table)

| Mevcut Durum | Hedef Durum | Aktör | Koşul |
| :--- | :---: | :---: | :--- |
| `DRAFT` | `SUBMITTED` | Müşteri | Form eksiksiz dolduruldu |
| `SUBMITTED` | `PENDING_REVIEW` | Sistem | Otomatik geçiş |
| `PENDING_REVIEW` | `AWAITING_ASSIGNMENT` | Admin | Detaylar uygun bulundu |
| `AWAITING_ASSIGNMENT` | `ASSIGNED` | Admin | Uygun temizlikçi seçildi |
| `ASSIGNED` | `CONFIRMED` | Admin/Sistem | Personel onayladı/Admin zorunlu kıldı |
| `CONFIRMED` | `IN_PROGRESS` | Sistem | Randevu zamanı geldi |
| `IN_PROGRESS` | `COMPLETED` | Temizlikçi | İş bitiş onayı verildi |
| *Herhangi* | `CANCELED` | Admin/Müşteri | İptal politikasına uygunluk |
| `CONFIRMED` | `RESCHEDULED` | Admin | Yeni tarih/saat seçildi |

---

## 6. Temizlikçi Başvuru Hattı (Cleaner Application Pipeline)
1. **Submitted:** Aday formu doldurur (TCKN, İletişim, Bölge).
2. **Under Review:** Admin ilk elemeyi yapar.
3. **Document Review:** Adli sicil kaydı ve kimlik doğrulaması yapılır.
4. **Interview:** Yüz yüze veya online mülakat gerçekleştirilir.
5. **Approved:** Aday uygun bulunur.
6. **Account Created:** Admin manuel olarak "User" kaydı oluşturur ve şifre belirler.
7. **First Login:** Temizlikçi giriş yapar, şifresini değiştirir ve KVKK metinlerini onaylar.
8. **Active:** Personel artık iş ataması alabilir duruma gelir.

---

## 7. RBAC Yetki Matrisi (RBAC Matrix)

| Yetki | Müşteri | Temizlikçi | Super Admin |
| :--- | :---: | :---: | :---: |
| Randevu Oluşturma | EVET | HAYIR | EVET |
| Kendi İşini İptal Etme | EVET (Süreli) | HAYIR | EVET |
| Kendi Adresini/Telini Görme | EVET | EVET | EVET |
| Başkasının Adresini Görme | HAYIR | SADECE ATANAN | EVET |
| **T.C. No / Adli Sicil Görme** | HAYIR | HAYIR | **EVET (Maskeli/Loglu)** |
| Temizlikçi Hesabı Açma | HAYIR | HAYIR | EVET |
| Slot Override Yetkisi | HAYIR | HAYIR | EVET |
| Statik İçerik Yönetimi | HAYIR | HAYIR | EVET |

---

## 8. Hassas Veri Güvenliği Mimarisi (Sensitive Data Security)
- **Veri Sınıflandırma:** TCKN ve Adli Sicil Belgesi "Critical/Highly Sensitive" olarak sınıflandırılır.
- **Depolama:** Belgeler kamuya açık olmayan (Private) S3 Bucket içerisinde tutulur.
- **Erişim:** Admin panele giriş yapan kullanıcıya belge erişimi için 5 dakika geçerli "Pre-signed URL" üretilir.
- **Şifreleme:** TCKN verisi veritabanında `AES-256-GCM` ile uygulama katmanında şifrelenerek saklanır.
- **Audit Logging:** Bir admin bir personelin TCKN'sini veya belgesini görüntülediğinde: `[AdminID, TargetID, Timestamp, IP]` kaydı tutulur.
- **Silme Politikası:** İşten ayrılan veya reddedilen personelin hassas verileri 30 gün sonunda otomatik "soft-delete", 90 gün sonunda "hard-delete" edilir.

---

## 9. Revize Edilen Veritabanı Şeması (Revised Schema)

### Table: Users
- `id`, `email`, `role` (CUSTOMER, CLEANER, ADMIN), `password_hash`, `mfa_enabled`

### Table: Cleaners
- `id`, `user_id`, `tckn_encrypted`, `bio`, `experience_years`, `rating`, `status` (ACTIVE, INACTIVE, SUSPENDED)

### Table: Districts
- `id`, `name` (İstanbul ilçeleri), `is_active`

### Table: Bookings
- `id`, `customer_id`, `cleaner_id` (Nullable), `status` (State Machine Enum), `district_id`, `address_text`, `lat`, `lng`, `start_time`, `end_time`, `admin_notes`

### Table: AuditLogs
- `id`, `actor_id`, `action`, `target_resource`, `changes_payload`, `timestamp`

---

## 10. Backend-Ready Klasör Yapısı (Folder Structure)
```
src/
├── app/                  # Route Handlers & Server Components
│   ├── (public)/         # SEO pages (Landing, FAQ, Services)
│   ├── (auth)/           # Secure login flows
│   ├── customer/         # Customer Private Dashboard
│   ├── cleaner/          # Cleaner Private Dashboard
│   ├── admin/            # Master Operations Dashboard
│   └── api/              # Backend Controllers (REST/Server Actions)
├── modules/              # İş Mantığı Modülleri
│   ├── booking/          # Slot calculation, conflict engine
│   ├── scheduling/       # Calendar logic, overlaps
│   ├── application/      # Cleaner onboarding pipeline
│   ├── security/         # Encryption, masking, audit logs
│   └── notification/     # Email/SMS templates & dispatchers
├── components/           # UI Primitives & Library
├── hooks/                # Client-side state hooks
├── lib/                  # Shared utilities & constants
└── middleware.ts         # Global RBAC & Security layer
```

---

## 11. Uygulama Fazları (Implementation Phases)
1. **Faz 1 (Framework):** IA, public sayfalar, temel UI bileşenleri ve mock-up veriler (TAMAMLANDI).
2. **Faz 2 (State & Logic):** Booking motoru, durum makinesi entegrasyonu ve admin takvim kontrolü.
3. **Faz 3 (Security & Backend):** Auth, DB şeması, şifreli veri saklama ve audit log altyapısı.
4. **Faz 4 (Integration):** Gerçek zamanlı bildirimler ve final stabilizasyon.

---

## 12. Kalan Üretim Riskleri (Remaining Production Risks)
- **Trafik Tahmini:** İstanbul trafiği seyahat sürelerini buffer ötesine taşıyabilir; manuel admin müdahalesi gerekebilir.
- **Yasal Uyumluluk:** KVKK süreçlerinin hukuk danışmanlığınca onaylanması şarttır.
- **Belge Geçerliliği:** Adli sicil kayıtlarının manuel doğrulanması operasyonel yük oluşturabilir.
- **Auth Güvenliği:** Sistemin kalbi olan admin panelinin MFA (Çok faktörlü doğrulama) ile korunması elzemdir.
