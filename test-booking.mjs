import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const booking = await prisma.booking.create({
      data: {
        customerName: "Test",
        customerPhone: "05555555555",
        customerEmail: "test@test.com",
        serviceId: "HOME_CLEANING",
        districtId: "Kadıköy",
        address: "Test adres",
        notes: "",
        startAt: new Date(`2026-05-18T09:00:00`),
        endAt: new Date(`2026-05-18T09:00:00`), 
        status: 'SUBMITTED',
      }
    });
    console.log("Success:", booking);
  } catch (e) {
    console.error("Error creating booking:", e);
  }
}
test();
