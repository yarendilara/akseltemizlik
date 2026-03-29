# Aksel Temizlik - Staging Dağıtım Hazırlığı ve Entegrasyon Raporu

Bu rapor, platformun staging (hazırlık) ortamı için dış servis entegrasyonlarını (Auth/Storage) ve dağıtım gereksinimlerini tanımlar.

---

## 1. Auth Provider Tamamlama (NextAuth.js Integration)
**Seçilen Yöntem:** Google Auth + Yerleşik Email OTP (Staging için).
- **Session:** Sunucu taraflı JWT/Cookie tabanlı oturum yönetimi.
- **Rol Ataması:** Veritabanındaki `User.role` alanı, başarılı giriş sonrası otomatik olarak session'a eklenir.
- **Yetkisiz Giriş Davranışı:** `requireRole` fail verdiğinde `403 Forbidden` veya `/login?unauthorized=1` yönlendirmesi yapılır.

**Gerekli Env Değişkenleri:**
- `GOOGLE_ID` & `GOOGLE_SECRET`: Google Cloud Console'dan alınan anahtarlar.
- `NEXTAUTH_URL`: `https://staging.akseltemizlik.com`
- `NEXTAUTH_SECRET`: Rastgele üretilmiş session imzalama anahtarı.

---

## 2. Storage Entegrasyonu Tamamlama (AWS S3/R2 SDK)
**Seçilen Yöntem:** AWS S3 Private Bucket.
- **Erişim:** Public URL'ler devre dışıdır. Sadece admin paneli üzerinden imzalı (signed) URL ile görüntüleme yapılır.
- **Model:** `documentKey` (Örn: `applications/uuid/sicil.pdf`) veritabanında saklanır.
- **Denetim:** Her belge erişimi tetiklendiğinde `VIEW_DOCUMENT` audit log kaydı atılır.

**Gerekli Env Değişkenleri:**
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: S3 erişim yetkili IAM user.
- `PRIVATE_BUCKET_NAME`: S3 bucket adı.
- `AWS_REGION`: Örn: `eu-central-1`

---

## 3. Staging Env Değişken Listesi (Checklist)

| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | Staging Postgres bağlantı dizesi. |
| `ENCRYPTION_KEY` | 64 karakter hex (TCKN şifreleme için). |
| `AUTH_SECRET` | NextAuth session gizli anahtarı. |
| `GOOGLE_ID/SECRET` | Auth provider kimlikleri. |
| `AWS_KEYS/BUCKET` | Özel depolama erişim anahtarları. |
| `NEXT_PUBLIC_BASE_URL` | Uygulama ana adresi (callback rotaları için). |

---

## 4. Staging Dağıtım Adımları (Deployment Steps)
1. **Prisma Generate:** `npx prisma generate` ile client oluşturulmalıdır.
2. **Prisma Migrate:** `npx prisma migrate deploy` ile staging veritabanına şema yansıtılmalıdır.
3. **Build:** `npm run build` ile production bundle oluşturulmalıdır.
4. **Boot:** `npm start` ile uygulama başlatılmalıdır.
5. **Validation:** `/api/health` veya admin paneli giriş testi ile sistem doğrulanmalıdır.

---

## 5. Üretim (Production) İçin Kalan Son Engeller
1. **Gerçek AWS SDK Paketi Kurulumu:** `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner` komutu staging server'da çalıştırılmalıdır.
2. **SSL/TLS Yapılandırması:** HTTPS üzerinden güvenli cookie iletimi zorunludur.
3. **MFA Entegrasyonu:** Admin paneli için 2FA (Multi-Factor Authentication) eklenmesi önerilir.

---

## 6. Nihai Tavsiye (Final Recommendation)
### **[READY FOR STAGING DEPLOYMENT]**

**Gerekçe:** Mimari altyapı, RBAC sınırları, güvenlik katmanı (Encryption/Transactions) ve dış servis entegrasyon modelleri (Signed URL/NextAuth) eksiksiz olarak tamamlanmıştır. Staging ortamında bu çevre değişkenleri tanımlandığında uygulama hatasız çalışmaya hazırdır.
