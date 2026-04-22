import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_place_holder");

/**
 * Zinde Temizlik - Notification Service
 * Handles Email and SMS (Placeholder for Netgsm/Ileti Merkezi)
 */
export const NotificationService = {
  /**
   * Send Email via Resend
   */
  async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("[NOTIFICATION] Resend API Key missing. Skipping email to:", to);
        return;
      }
      await resend.emails.send({
        from: "Zinde Temizlik <info@zindetemizlik.info>",
        to,
        subject,
        html,
      });
      console.log(`[NOTIFICATION] Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error("[NOTIFICATION] Email error:", error);
    }
  },

  /**
   * Send SMS via Netgsm / Ileti Merkezi (Placeholder)
   */
  async sendSMS(phone: string, message: string) {
    try {
      console.log(`[NOTIFICATION-SMS-PLACEHOLDER] To: ${phone}, Msg: ${message}`);
      // Implementation for Netgsm/Ileti Merkezi would go here.
      // Example for Netgsm:
      // await fetch('https://api.netgsm.com.tr/sms/send/get', { method: 'POST', body: ... });
    } catch (error) {
      console.error("[NOTIFICATION] SMS error:", error);
    }
  },

  /**
   * High-level: Booking Confirmation
   */
  async notifyBookingReceived(booking: any) {
    const subject = "Rezervasyon Talebiniz Alındı - Zinde Temizlik";
    const html = `
      <h1>Merhaba ${booking.customerName},</h1>
      <p>Rezervasyon talebiniz başarıyla alınmıştır.</p>
      <ul>
        <li><strong>Hizmet:</strong> ${booking.serviceId}</li>
        <li><strong>Tarih:</strong> ${new Date(booking.startAt).toLocaleString('tr-TR')}</li>
        <li><strong>Adres:</strong> ${booking.address}</li>
      </ul>
      <p>Ekibimiz kısa süre içinde değerlendirme yapıp size onay mesajı gönderecektir.</p>
      <p>Bizi tercih ettiğiniz için teşekkürler!</p>
    `;
    
    await this.sendEmail(booking.customerEmail, subject, html);
    await this.sendSMS(booking.customerPhone, `Merhaba ${booking.customerName}, Zinde Temizlik rezervasyon talebiniz alindi. En kisa surede donus yapilacaktir.`);
  },

  /**
   * High-level: Team Assigned
   */
  async notifyTeamAssigned(booking: any, cleanerName: string) {
    const subject = "Randevunuza Ekip Atandı! - Zinde Temizlik";
    const html = `
      <h1>Güzel Haber!</h1>
      <p>Randevunuza temizlik uzmanımız <strong>${cleanerName}</strong> atanmıştır.</p>
      <p>Planlanan zamanda görüşmek üzere.</p>
    `;
    
    await this.sendEmail(booking.customerEmail, subject, html);
    await this.sendSMS(booking.customerPhone, `Zinde Temizlik: Randevunuza ${cleanerName} atanmistir. Belirlenen saatte gorusmek uzere.`);
  }
};
