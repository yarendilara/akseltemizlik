/**
 * Aksel Temizlik - Operasyonel Rezervasyon Motoru
 * Bu modül, slot hesaplama, çakışma kontrolü ve admin override mantığını yönetir.
 */

import { SERVICE_CONFIG, BookingStatus } from './constants';

export type Slot = {
  startTime: string; // HH:mm
  endTime: string;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'blocked_by_admin' | 'buffer_zone';
  reason?: string;
};

export class BookingService {
  /**
   * Bir gün için uygun slotları hesaplar.
   * Lojik: 
   * 1. 09:00 - 18:00 arası 30'ar dakikalık dilimleri tara.
   * 2. Seçilen hizmetin süresini + buffer'ı hesaba kat.
   * 3. Admin blokelerini kontrol et (En yüksek öncelik).
   */
  static getAvailableSlots(
    date: string, 
    district: string, 
    serviceId: keyof typeof SERVICE_CONFIG
  ): Slot[] {
    const config = SERVICE_CONFIG[serviceId];
    const totalDuration = config.duration + config.buffer;
    
    // Basitleştirilmiş slot listesi (Sadece başlangıç saatlerini gösterir)
    const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

    // Mock DB verileri (Canlıda buradan çekilecek)
    const mockBookings = [
      { start: "11:00", end: "15:00", status: "CONFIRMED" }
    ];
    const mockAdminBlocks = ["09:00", "16:00"]; // Admin bu sabahtan bir saati ve akşam bir saati bloklamış

    return timeSlots.map(time => {
      const isBlockedByAdmin = mockAdminBlocks.includes(time);
      const isBooked = this.isTimeOverlap(time, totalDuration, mockBookings);
      const isBufferZone = false; // Detaylı lojik eklenebilir

      let status: Slot['status'] = 'available';
      if (isBlockedByAdmin) status = 'blocked_by_admin';
      else if (isBooked) status = 'booked';

      return {
        startTime: time,
        endTime: this.calculateEndTime(time, config.duration),
        isAvailable: !isBlockedByAdmin && !isBooked,
        status,
        reason: isBlockedByAdmin ? "Admin Tarafından Kapalı" : (isBooked ? "Dolu" : undefined)
      };
    });
  }

  private static isTimeOverlap(checkTime: string, duration: number, bookings: any[]): boolean {
    const checkStart = this.timeToMinutes(checkTime);
    const checkEnd = checkStart + duration;

    return bookings.some(b => {
      const bStart = this.timeToMinutes(b.start);
      const bEnd = this.timeToMinutes(b.end);
      return (checkStart < bEnd && checkEnd > bStart);
    });
  }

  private static calculateEndTime(startTime: string, durationMinutes: number): string {
    const minutes = this.timeToMinutes(startTime) + durationMinutes;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private static timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
}
