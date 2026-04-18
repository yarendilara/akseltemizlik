import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// Crucial fix: Use reliable HTTP fetch instead of failing WebSockets on Serverless Nodes
neonConfig.fetchConnectionCache = true;

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"], // Audit logs and debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
