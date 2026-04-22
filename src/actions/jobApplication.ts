"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitJobApplication(payload: {
  fullName: string;
  residence: string;
  phone: string;
  email?: string;
  birthDate: Date;
  experience: string;
}) {
  try {
    const application = await prisma.jobApplication.create({
      data: {
        fullName: payload.fullName,
        residence: payload.residence,
        phone: payload.phone,
        email: payload.email || null,
        birthDate: payload.birthDate,
        experience: payload.experience,
        status: "SUBMITTED",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "SUBMIT_JOB_APP",
        targetResource: "JobApplication",
        targetId: application.id,
        payload: JSON.stringify({ fullName: payload.fullName, phone: payload.phone }),
      },
    });

    revalidatePath("/admin/basvurular");
    return { success: true };
  } catch (error: unknown) {
    console.error("Job application error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

export async function getJobApplications() {
  await requireRole("ADMIN");
  return await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateJobApplicationStatus(id: string, status: string) {
  const session = await requireRole("ADMIN");
  await prisma.$transaction(async (tx) => {
    await tx.jobApplication.update({
      where: { id },
      data: { status },
    });
    
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "UPDATE_JOB_APP_STATUS",
        targetResource: "JobApplication",
        targetId: id,
        payload: JSON.stringify({ status }),
      },
    });
  });
  revalidatePath("/admin/basvurular");
  return { success: true };
}
