import { prisma } from "./prisma";

/**
 * Zinde Temizlik - Simple Database-backed Rate Limiting
 * Protects against brute force and spam on serverless environments.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<{ success: boolean; remaining: number }> {
  const now = new Date();
  const windowMillis = windowSeconds * 1000;

  try {
    const record = await prisma.rateLimit.findUnique({
      where: { key }
    });

    if (!record || record.expiresAt < now) {
      // New window
      await prisma.rateLimit.upsert({
        where: { key },
        update: {
          count: 1,
          expiresAt: new Date(now.getTime() + windowMillis)
        },
        create: {
          key,
          count: 1,
          expiresAt: new Date(now.getTime() + windowMillis)
        }
      });
      return { success: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0 };
    }

    // Increment existing window
    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } }
    });

    return { success: true, remaining: limit - updated.count };
  } catch (error) {
    console.error("[RATE-LIMIT] Error:", error);
    return { success: true, remaining: 0 }; // Fail open but log
  }
}
