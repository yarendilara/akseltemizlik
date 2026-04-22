import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

async function main() {
  const url = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Jm6Uajz5xBFi@ep-billowing-moon-aijxruj1-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  console.log("Admin found:", JSON.stringify(admin, null, 2));

  if (!admin) {
    const allUsers = await prisma.user.findMany();
    console.log("All users count:", allUsers.length);
    console.log("Roles:", allUsers.map(u => u.role));
  }
}

main().catch(console.error);
