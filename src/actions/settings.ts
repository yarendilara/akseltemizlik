"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSiteSetting(key: string) {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key }
    });
    return setting ? JSON.parse(setting.value) : null;
  } catch (error) {
    console.error(`Get setting ${key} error:`, error);
    return null;
  }
}

export async function updateSiteSetting(key: string, value: unknown) {
  await requireRole("ADMIN");
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });
    revalidatePath("/admin/ayarlar");
    revalidatePath("/rezervasyon");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}
