import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const counts = await prisma.jobApplication.count();
    console.log("--- APP COUNT ---");
    console.log(counts);
    console.log("------------------");
    
    const logs = await prisma.auditLog.findMany({
      where: { action: "SUBMIT_JOB_APP" }
    });
    console.log("--- SUBMIT LOGS ---");
    console.log(logs.length);
    console.log("------------------");
  } catch (err) {
    console.error("FAIL:", err);
  }
}

main().finally(() => prisma.$disconnect());
