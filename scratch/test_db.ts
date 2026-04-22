import { prisma } from "./src/lib/prisma";

async function test() {
  try {
    console.log("Creating test application...");
    const app = await prisma.jobApplication.create({
      data: {
        fullName: "Test User",
        residence: "Test City",
        phone: "05555555555",
        birthDate: new Date(),
        experience: "Test experience",
        status: "SUBMITTED"
      }
    });
    console.log("Success:", app);
    const count = await prisma.jobApplication.count();
    console.log("Total applications:", count);
  } catch (err) {
    console.error("Error creating application:", err);
  }
}

test();
