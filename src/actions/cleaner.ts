"use client";

/**
 * Aksel Temizlik - Hardened Cleaner Actionları
 * Faz 2: Uygulama Başvurusu ve İş Takipleri
 */

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { encryptSensitiveData } from "@/lib/encryption";

/**
 * 1. Temizlikçi Başvurusu (Public Action)
 * No role required, but security hardening on data.
 */
export async function submitCleanerApplication(payload: { fullName: string, tckn: string, phone: string, email: string, districts: string[], serviceIds: string[], documentKey: string }) {
  // 1. Transaction Safety & Integrity Checks
  return await prisma.$transaction(async (tx) => {
    // 2. Check for Duplicate Application
    const existing = await tx.cleanerApplication.findFirst({
        where: {
            OR: [
                { email: payload.email },
                { tcknEncrypted: payload.tckn }
            ]
        }
    });

    if (existing) throw new Error("Bu bilgilerle zaten aktif bir başvurunuz bulunmaktadır.");

    // 3. Create Entry (Atomic) with Application-Layer Encryption
    const application = await tx.cleanerApplication.create({
      data: {
        fullName: payload.fullName,
        tcknEncrypted: encryptSensitiveData(payload.tckn), 
        phone: payload.phone,
        email: payload.email,
        districts: JSON.stringify(payload.districts),
        serviceIds: JSON.stringify(payload.serviceIds),
        documentKey: payload.documentKey, // Private Key
        status: "SUBMITTED"
      }
    });

    // 4. Audit Log (Hassas Veri Girişi Loglanır)
    await tx.auditLog.create({
      data: {
        actorId: "SYSTEM_PUBLIC",
        action: "SUBMIT_CLEANER_APP",
        targetResource: "CleanerApplication",
        targetId: application.id,
        payload: JSON.stringify({ email: payload.email, districts: payload.districts })
      }
    });

    revalidatePath("/hizmet-veren-ol");
    return { success: true };
  });
}

/**
 * 2. İş Durumu Güncelleme (Ownership & State Check)
 */
export async function updateJobStatus(bookingId: string, newStatus: 'IN_PROGRESS' | 'COMPLETED') {
  // 1. Session Resolve & Role Check
  const session = await requireRole("CLEANER");

  return await prisma.$transaction(async (tx) => {
    // 2. Resolve Profile
    const profile = await tx.cleanerProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) throw new Error("Temizlikçi profili bulunamadı.");

    // 3. Assignment Ownership Verification
    const assignment = await tx.bookingAssignment.findFirst({
      where: {
        bookingId,
        cleanerId: profile.id
      }
    });

    if (!assignment) throw new Error("Bu işe atanmış değilsiniz.");

    // 4. Atomic Status Update & Audit
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus as any }
    });

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "UPDATE_JOB_STATUS",
        targetResource: "Booking",
        targetId: bookingId,
        payload: JSON.stringify({ newStatus })
      }
    });

    revalidatePath("/temizlikci/dashboard");
    return { success: true };
  });
}
