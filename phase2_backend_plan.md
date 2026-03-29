# Aksel Temizlik - Faz 2: Backend Temeli ve Kural Uygulama Planı

Bu döküman, onaylanan mimari üzerinden platformun backend fonksiyonlarını, veritabanı şemasını ve operasyonel iş akışlarını tanımlar.

---

## 1. Backend Mimarisi (Backend Architecture)
Sistem, Next.js **Server Actions** ve **Edge Runtime** uyumlu bir servis katmanı (Service Layer) mimarisi üzerine kurulacaktır:
- **Service Layer:** İş mantığının (slot hesaplama, durum değişikliği) UI'dan ayrıştırıldığı katman.
- **Repository Pattern:** Veritabanı işlemlerinin (CRUD) soyutlandığı katman.
- **Middleware:** Tüm isteklerde Role-Based Access Control (RBAC) denetimi yapan katman.

---

## 2. Detaylı Veritabanı Şeması (Database Schema - Implementation Detail)

### Users (Prisma/SQL Definition)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password_hash`: String
- `role`: Enum (ADMIN, CLEANER, CUSTOMER)
- `created_at`: DateTime
- `mfa_secret`: String (Nullable)

### CleanerProfiles
- `id`: UUID
- `user_id`: UUID (FK to Users)
- `tckn_encrypted`: Text (AES-256-GCM)
- `districts`: String[] (Hangi ilçelere hizmet veriyor?)
- `services`: String[] (Hangi uzmanlıklara sahip?)
- `status`: Enum (ACTIVE, INACTIVE, SUSPENDED)
- `availability_config`: Json (Haftalık çalışma saatleri şablonu)

### CleanerApplications
- `id`: UUID
- `full_name`: String
- `tckn_raw_encrypted`: Text
- `documents_s3_key`: String (Private Bucket Path)
- `status`: Enum (SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)
- `application_date`: DateTime

### Bookings (States: Draft -> Completed)
- `id`: UUID
- `customer_id`: UUID
- `cleaner_id`: UUID (Nullable)
- `status`: BookingStatus (Enum)
- `service_id`: String
- `district_id`: String
- `appointment_start`: DateTime
- `appointment_end`: DateTime (Duration + Buffer dahil hesaplanmış)
- `admin_override`: Boolean

### AuditLogs
- `id`: UUID
- `actor_id`: UUID
- `action_type`: String (e.g., "VIEW_TCKN", "CHANGE_ASSIGNMENT")
- `resource_id`: String
- `metadata`: Json (IP, User Agent, Changes)

---

## 3. API ve Server Action Listesi (Critical Operations)

### Müşteri İşlemleri
- `createBookingTask(data)`: Yeni randevu talebi (Pending Review).
- `getCustomerBookings()`: Sadece kendi geçmişini çeker.
- `requestReschedule(bookingId, newDate)`: Değişiklik talebi oluşturur.

### Temizlikçi İşlemleri
- `getAssignedJobs()`: Sadece onaylanan ve atanan işleri görür.
- `updateWorkStatus(bookingId, status)`: "İşe Başladım" / "Tamamladım".
- `submitApplication(formData)`: İlk başvuru formu.

### Super Admin İşlemleri (Operasyon Merkezi)
- `approveApplication(appId)`: Başvuruyu onaylar ve manuel kullanıcı oluşturma tetikler.
- `assignCleaner(bookingId, cleanerId)`: Manuel personel ataması.
- `blockCalendarSlot(date, time)`: Master takvimde slot kapatma.
- `overrideBooking(bookingId, overrideData)`: Müşteri talebine idari müdahale.
- `viewSensitiveData(resourceId)`: TCKN maskesini kaldırır ve loglar.

---

## 4. Auth ve RBAC Denetim Planı (Auth & RBAC Enforcement)
- **Token Based:** NextAuth.js veya JWT tabanlı güvenli oturum yönetimi.
- **Middleware Protection:** 
    - `/admin/*` -> Sadece `role === 'ADMIN'`
    - `/cleaner/*` -> Sadece `role === 'CLEANER'`
- **Action Level Security:** Her Server Action içinde `session.role` kontrolü ve işlemin sahipliği (Ownership check) doğrulaması.

---

## 5. Rezervasyon Motoru Akışı (Booking Engine Flow)
1. **Validation:** Seçilen tarih/ilçe kontrolü.
2. **Conflict Check:** Aynı personel veya aynı bölge kapasite kısıtı denetimi.
3. **Draft Entry:** Veritabanına `SUBMITTED` durumunda kayıt.
4. **Admin Notification:** Operasyon paneline "Yeni Randevu" bildirimi.
5. **Slot Reservation:** İş tamamlanana veya iptal edilene kadar takvimde ilgili saatlerin (Süre + Buffer) rezerve tutulması.

---

## 6. Admin Takvim Akışı (Admin Calendar Flow)
- **Aggregated View:** Tüm aktif temizlikçilerin (Bölge filtresiyle) müsaitliklerinin üst üste bindirilmesi (Overlay).
- **Manual Input:** Admin'in sürükle-bırak (Drag & Drop) ile atama yapabilmesi.
- **Global Constraints:** Bayram, tatil veya özel günlerde adminin tek tıkla tüm İstanbul'u veya belirli ilçeyi yeni randevuya kapatması.

---

## 7. Temizlikçi Başvuru Moderasyon Akışı (Cleaner Moderation)
1. **İnceleme:** Gelen başvuruların admin ekranında listelenmesi.
2. **Belge Kontrolü:** S3 üzerinden adli sicil kaydının imzalı (signed) URL ile görüntülenmesi.
3. **Karar:** `APPROVED` durumuna çekilen başvuru için `Account Generator` tetiklenir ve personele tek kullanımlık şifre gönderilir.

---

## 8. Audit Logging Planı
- **Kritik Olaylar:** Login denemeleri, durum değişiklikleri, atama değişiklikleri, hassas veri görüntüleme.
- **Yapı:** Her log, "kim, ne zaman, hangi veriyi, nereden (IP) gördü/değiştirdi" bilgisini değişmez (immutable) şekilde saklar.

---

## 9. Depolama ve Güvenlik Planı (Storage & Security)
- **Encryption:** `crypto` kütüphanesi ile TCKN gibi alanları DB'de `IV + Ciphertext` formatında saklama.
- **Signed Access:** Adli sicil kayıtları `Content-Disposition: attachment` ve `Expires: 300` parametreleriyle servis edilir.
- **Least Privilege:** API anahtarları ve DB kullanıcısı sadece gerekli tablolara erişim yetkisine sahip olacak şekilde yapılandırılır.

---

## 10. Uygulama Sırası (Implementation Order)
1. **Sprint 1:** Veritabanı şeması kurulumu ve Auth/RBAC altyapısının NextAuth ile kurulması.
2. **Sprint 2:** Booking Engine Backend (Durum makinesi ve slot hesaplama lojiği).
3. **Sprint 3:** Admin Master Takvim (Calendar UI ve Backend integrasyonu).
4. **Sprint 4:** Temizlikçi başvuru moderasyonu, güvenli depolama ve Audit Logging modülü.
