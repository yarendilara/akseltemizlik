# Aksel Temizlik - Staging Devir ve Canlıya Çıkış Doğrulama Kılavuzu

Uygulama staging (hazırlık) dağıtımı için onaylanmıştır. Bu doküman, dağıtım sonrası yapılacak teknik devir ve doğrulama adımlarını içerir.

---

## 1. Staging Devir Kontrol Listesi (Handoff Checklist)

### Gerekli Çevre Değişkenleri (Environment Variables)
Aşağıdaki değişkenlerin staging sunucusunda tanımlanması zorunludur:
- `DATABASE_URL`: Staging PostgreSQL bağlantı dizesi.
- `ENCRYPTION_KEY`: 64 karakterli (32-byte) hex-encoded şifreleme anahtarı.
- `AUTH_SECRET`: NextAuth.js session imzalama anahtarı.
- `NEXTAUTH_URL`: `https://staging.akseltemizlik.com`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Dashbord erişimi için Google OAuth kimlikleri.
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: S3 erişim IAM anahtarları.
- `AWS_REGION` & `PRIVATE_BUCKET_NAME`: Belge depolama yapılandırması.

### Dağıtım Komutları (Deploy Commands)
1. Bağımlılıkları kur: `npm install`
2. Prisma Client üret: `npx prisma generate`
3. DB Şemasını güncelle: `npx prisma migrate deploy`
4. Uygulamayı derle: `npm run build`
5. Uygulamayı başlat: `npm start`

### Geri Çağırma (Callback) Ayarları
- **Google Cloud Console:** Authorized redirect URI: 
  `https://staging.akseltemizlik.com/api/auth/callback/google`

---

## 2. Dağıtım Sonrası Smoke Test (Post-Deploy Smoke Checklist)

| Test Edilecek İşlem | Beklenen Davranış | Durum |
| :--- | :--- | :---: |
| **Giriş (Sign-in)** | Google veya yetkili e-posta ile giriş başarılı. | [ ] |
| **Oturum Devamı** | Sayfa yenilendiğinde oturum korunuyor (Session persistence). | [ ] |
| **Rota Koruması (RBAC)** | `/admin` rotasına sadece admin, `/temizlikci` rotasına sadece temizlikçi girebiliyor. | [ ] |
| **Randevu Oluşturma** | Müşteri paneli üzerinden yeni talep oluşturulabiliyor (DB Insert). | [ ] |
| **Slot Engelleyici** | Admin tarafından bloklanan saate randevu alınması engelleniyor. | [ ] |
| **Temizlikçi Atama** | Admin bir işi temizlikçiye atayabiliyor ve statü değişiyor. | [ ] |
| **Hassas Veri Log** | TCKN görüntülendiğinde Audit Log tablosuna kayıt düşüyor. | [ ] |
| **İmzalı Link (Private S3)** | Adli sicil kaydı linki başarılı üretiliyor ve 5 dk sonra expire oluyor. | [ ] |

---

## 3. Üretim Canlıya Geçiş (Production Go-Live Checklist)

1. [ ] **HTTPS/SSL Doğrulama:** Cookie'lerin `Secure` ve `HttpOnly` flag'lerinin canlıda çalıştığı kontrol edilmelidir.
2. [ ] **MFA (2FA) Aktivasyonu:** Admin paneli girişleri için Google Authenticator desteği eklenmelidir.
3. [ ] **Veri Temizliği:** Tanımlanan test kayıtlarının silinmesi ve DB'nin "Temiz Start" vermesi.
4. [ ] **Hata İzleme (Sentry/Log):** Üretim hatalarının (Runtime errors) izlenmesi için araç bağlantıları kontrol edilmelidir.

---

## 4. Statü Yükseltme Koşulları (Upgrade to READY FOR PRODUCTION)

Aşağıdaki **3 kriter** sağlandığında statü **READY FOR PRODUCTION** olarak güncellenecektir:

1. **End-to-End Cloud Handshake:** Staging sunucusunda gerçek AWS S3 üzerinden bir PDF belgesinin admin tarafından başarıyla indirildiğinin teyit edilmesi.
2. **Auth Stability:** Google OAuth girişinin gerçek bir e-posta ile oturum açtığının ve session'ın 7 gün boyunca hatasız sürdüğünün doğrulanması.
3. **Audit Integrity:** Audit Log kayıtlarının veritabanında "Immutable" (değiştirilemez) şekilde saklandığının operasyonel onayı.
