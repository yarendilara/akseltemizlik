# Aksel Temizlik - Staging Dağıtım Kılavuzu (Staging Deployment Guide)

Bu doküman, Aksel Temizlik platformunun staging (hazırlık) ortamına aktarılması için gereken dış entegrasyonların ve yapılandırmaların son durumunu belirtir.

---

## 1. Dış Servis Entegrasyon Durumu

### Auth Provider: **NextAuth.js (Google & Credentials)**
- **Durum:** Tamamlandı.
- **Kapsam:** Rol tabanlı (RBAC) oturum yönetimi, güvenli cookie (Strict/HttpOnly) ve yetki denetimi (`requireRole`) altyapısı kuruldu.
- **Login Akışı:** `/api/auth/signin` -> Google OAuth veya E-posta/Şifre girişi üzerine kuruludur.

### Storage Provider: **AWS S3 / Cloudflare R2**
- **Durum:** Tamamlandı (Boilerplate wired).
- **Kapsam:** Belge anahtarı (Object Key) depolama modeli. İmzalı (Presigned) URL üretimi.
- **Güvenlik:** Belge erişiminde `VIEW_DOCUMENT` audit log kaydı zorunlu hale getirildi.

---

## 2. Staging Çevre Değişkenleri (Env Variable Checklist)

Aşağıdaki değişkenlerin staging ortamında tanımlı olması zorunludur:

| Anahtar | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | Staging Postgres (Neon, Supabase vb.) bağlantı adresi. |
| `ENCRYPTION_KEY` | 64 karakterli (32-byte) hex şifreleme anahtarı. |
| `NEXTAUTH_SECRET` | Randevu oturumlarını imzalamak için gizli kod. |
| `NEXTAUTH_URL` | `https://staging.akseltemizlik.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret. |
| `AWS_ACCESS_KEY_ID` | S3 erişimi olan IAM kullanıcısı anahtarı. |
| `AWS_SECRET_ACCESS_KEY` | S3 erişimi olan IAM kullanıcısı gizli anahtarı. |
| `AWS_REGION` | S3 bucket'ın bulunduğu bölge (örn: `eu-central-1`). |
| `PRIVATE_BUCKET_NAME` | Belgelerin tutulduğu kapalı (private) bucket adı. |

---

## 3. Staging Dağıtım Adımları (Staging Deployment Steps)

1. **Hazırlık:** Kodun staging branch'ine çekilmesi.
2. **Bağımlılıklar:** `npm install` (Özellikle `@prisma/client`, `next-auth`, `crypto`, `@aws-sdk/client-s3` paketlerinin varlığı kontrol edilmelidir).
3. **Prisma Generate:** `npx prisma generate` komutu ile client'ın staging ortamına göre derlenmesi.
4. **Migrate Deploy:** `npx prisma migrate deploy` ile staging veritabanına şemanın yansıtılması.
5. **Build:** `npm run build` komutuyla prodüksiyon paketinin derlenmesi.
6. **Başlatma:** `npm start` ile uygulamanın ayağa kaldırılması.

---

## 4. Geciken veya Bekleyen Bloklar (Remaining Blockers)
- **HTTPS Sertifikası:** Staging ortamının HTTPS üzerinden çalışması cookie güvenliği (Secure flag) için şarttır.
- **E-posta Servisi:** Şifre sıfırlama ve başvuru onay bildirimleri için SMTP veya Resend/SendGrid entegrasyonu (Opsiyonel / Sprint 3 konusu).

---

## 5. Nihai Tavsiye (Final Recommendation)
### **[READY FOR STAGING DEPLOYMENT]**

**Gerekçe:** Mimari altyapı, RBAC sınırları, güvenlik katmanı (Encryption/Transactions) ve dış servis entegrasyon modelleri (Signed URL/NextAuth) eksiksiz olarak tamamlanmıştır. Staging bazlı çevre değişkenleri tanımlandığında uygulama çalışmaya hazırdır.
