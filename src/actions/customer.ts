"use client";

/**
 * Aksel Temizlik - Hardened Customer Actionları
 * Faz 2: Rezervasyon Lojiği ve Güvenlik Sıkılaştırma
 */

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { SERVICE_CONFIG } from "@/lib/constants";
import { revalidatePath } from "next/cache";

/**
 * 1. Randevu Oluşturma (Transaction & Normalized UTC)
 */
export async function createBookingTask(payload: { serviceId: string, districtId: string, startAt: Date, address: string, notes?: string }) {
  // 1. Session Resolve & Role Check
  const session = await requireRole("CUSTOMER");

  // 2. Duration & Buffer Calculation
  const config = SERVICE_CONFIG[payload.serviceId as keyof typeof SERVICE_CONFIG];
  const startAt = new Date(payload.startAt);
  const endAt = new Date(startAt.getTime() + (config.duration + config.buffer) * 60000);

  return await prisma.$transaction(async (tx) => {
    // 3. Admin Calendar Block Check (Normalized Timestamp)
    const block = await tx.adminCalendarBlock.findFirst({
      where: {
        AND: [
          { startAt: { lt: endAt }, endAt: { gt: startAt } },
          { OR: [{ districtId: payload.districtId }, { districtId: null }] }
        ]
      }
    });

    if (block) throw new Error("Bu zaman dilimi operasyon ekibi tarafından kapatılmıştır.");

    // 4. Create Booking Entry
    const booking = await tx.booking.create({
      data: {
        customerId: session.user.id,
        serviceId: payload.serviceId,
        districtId: payload.districtId,
        startAt,
        endAt,
        address: payload.address,
        notes: payload.notes,
        status: "SUBMITTED"
      }
    });

    // 5. Audit Log (Transaction Internal)
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CREATE_BOOKING",
        targetResource: "Booking",
        targetId: booking.id,
        payload: JSON.stringify({ startAt, endAt, districtId: payload.districtId })
      }
    });

    revalidatePath("/rezervasyon");
    return { success: true, bookingId: booking.id };
  });
}

/**
 * 2. Müşteri İptal Akışı
 */
export async function cancelBookingRequest(bookingId: string) {
  const session = await requireRole("CUSTOMER");

  return await prisma.$transaction(async (tx) => {
    // 1. Ownership & State Check
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.customerId !== session.user.id) throw new Error("Rezervasyon erişim yetkiniz yok.");
    
    // Status Guard (Once confirmed, cancellation might require admin)
    if (booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') throw new Error("Devam eden veya tamamlanan işler iptal edilemez.");

    // 2. Atomic Update & Audit
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELED" }
    });

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CANCEL_BOOKING",
        targetResource: "Booking",
        targetId: bookingId,
        payload: JSON.stringify({ previousStatus: booking.status })
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  });
}
