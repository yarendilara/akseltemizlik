"use server";

/**
 * Aksel Temizlik - Hardened Admin Actionları
 * Faz 2: Transaction, Session-base Auth ve Güvenlik Sıkılaştırma
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { encryptSensitiveData, decryptSensitiveData } from "@/lib/encryption";
import { getSignedDocumentURL } from "@/lib/storage";

/**
 * Merkezi Audit Logger (Transaction İçinde Kullanıma Uygun)
 */
async function auditLog(tx: Prisma.TransactionClient, actorId: string, action: string, resource: string, targetId: string, data: any) {
  await tx.auditLog.create({
    data: {
      actorId,
      action,
      targetResource: resource,
      targetId,
      payload: JSON.stringify(data),
    },
  });
}

/**
 * 1. Admin Tarafından Temizlikçi Atama (Transaction & Conflict Guard)
 * Input: Sadece hedef ID'ler.
 */
export async function assignCleanerToBooking(bookingId: string, cleanerId: string) {
  // 1. Session Resolve & Role Check
  const session = await requireRole("ADMIN");

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 2. Fetch Target
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Rezervasyon bulunamadı.");

    // 3. Normalized Conflict Check (UTC)
    const overlapping = await tx.bookingAssignment.findFirst({
      where: {
        cleanerId,
        booking: {
          OR: [
            { startAt: { lt: booking.endAt }, endAt: { gt: booking.startAt } }
          ]
        }
      }
    });

    if (overlapping) throw new Error("Çakışan bir randevu mevcut.");

    // 4. Atomic Assignment & Status Update
    await tx.bookingAssignment.create({
      data: { bookingId, cleanerId }
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "ASSIGNED" }
    });

    // 5. Audit Log
    await auditLog(tx, session.user.id, "ASSIGN_CLEANER", "Booking", bookingId, { cleanerId });

    revalidatePath("/admin");
    return { success: true };
  });
}

/**
 * 2. Hassas Veri Görüntüleme (Signed URL & Access Audit)
 * Private doc references keep object keys hidden.
 */
export async function getSensitiveData(targetId: string, type: 'TCKN' | 'DOC') {
  const session = await requireRole("ADMIN");

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await auditLog(tx, session.user.id, `VIEW_${type}`, "Cleaner", targetId, { timestamp: new Date() });

    if (type === 'TCKN') {
      const profile = await tx.cleanerProfile.findUnique({ where: { id: targetId } });
      if (!profile) throw new Error("Profil bulunamadı.");
      
      // Real Decryption with Master Key from Env
      return { data: decryptSensitiveData(profile.tcknEncrypted) };
    } else {
      const app = await tx.cleanerApplication.findUnique({ where: { id: targetId } });
      if (!app) throw new Error("Başvuru bulunamadı.");
      
      // Real S3/R2 Signed URL Generation
      const signedUrl = await getSignedDocumentURL(app.documentKey);
      return { signedUrl, expires: 300 };
    }
  });
}

/**
 * 3. Başvuru Onaylama ve Hesap Oluşturma (Atomic Transaction)
 */
export async function approveCleanerApplication(applicationId: string) {
  const session = await requireRole("ADMIN");

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Get Application
    const app = await tx.cleanerApplication.findUnique({ where: { id: applicationId } });
    if (!app || app.status !== 'SUBMITTED') throw new Error("Geçerli bir başvuru bulunamadı.");

    // 2. Check if user already exists
    const existing = await tx.user.findUnique({ where: { email: app.email } });
    if (existing) throw new Error("Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.");

    // 3. Create User & Cleaner Profile Atomically
    const user = await tx.user.create({
      data: {
        email: app.email,
        passwordHash: "$2b$10$TEMP_HASH_WILL_TRIGGER_RESET",
        role: "CLEANER",
      }
    });

    await tx.cleanerProfile.create({
      data: {
        userId: user.id,
        tcknEncrypted: app.tcknEncrypted,
        districts: app.districts,
        services: app.serviceIds,
        status: "ACTIVE",
        availabilityConfig: "{}"
      }
    });

    // 4. Update Application Status
    await tx.cleanerApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED" }
    });

    // 5. Audit Log
    await auditLog(tx, session.user.id, "APPROVE_APPLICATION", "CleanerApplication", applicationId, { userId: user.id });

    revalidatePath("/admin/applications");
    return { success: true, message: "Hesap oluşturuldu ve yetkilendirme sağlandı." };
  });
}
