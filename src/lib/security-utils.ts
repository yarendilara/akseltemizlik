/**
 * Aksel Temizlik - Güvenlik ve Maskeleme Yardımcıları
 * KVKK ve operasyonel gizlilik standartlarını sağlar.
 */

export class SecurityUtils {
  /**
   * T.C. Kimlik numarasını maskeler. 
   * Sadece admin panelinde "Göster" yetkisiyle açılabilir.
   */
  static maskTCKN(tckn: string): string {
    if (!tckn || tckn.length < 11) return "***********";
    return tckn.substring(0, 2) + "*******" + tckn.substring(9);
  }

  /**
   * Ad Soyad maskeler (Müşteri bilgilerini koruma amaçlı).
   */
  static maskFullName(name: string): string {
    const parts = name.split(' ');
    return parts.map(p => p[0] + '*'.repeat(p.length - 1)).join(' ');
  }

  /**
   * Belgeler için geçici güvenli URL simülasyonu.
   * Production'da S3 Presigned URL kullanılır.
   */
  static getSecureDocumentLink(path: string): string {
    return `/api/secure-download?token=${btoa(path)}&expires=${Date.now() + 3600000}`; // 1 saat geçerli
  }

  /**
   * Admin yetkisi kontrolü (Simülasyon).
   */
  static hasAdminAccess(userRole: string): boolean {
    return userRole === 'SUPER_ADMIN';
  }
}
