import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const app = await prisma.jobApplication.create({
    data: {
      fullName: "Real Test " + new Date().toISOString(),
      residence: "Istanbul",
      phone: "05551112233",
      birthDate: new Date("1990-01-01"),
      experience: "Many years of cleaning",
      status: "SUBMITTED"
    }
  });
  console.log("Created:", app);
  const all = await prisma.jobApplication.findMany();
  console.log("All applications count:", all.length);
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
