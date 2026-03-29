import { PrismaClient } from "@prisma/client";

/**
 * Aksel Temizlik - Prisma Client (Singleton)
 * Bu dosya veritabanı bağlantılarını yönetir.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // Audit logs and debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
