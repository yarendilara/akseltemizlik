import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert 10-digit phone to standard format if needed
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');

    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        districtId: data.district,
        address: data.address,
        notes: data.notes || "",
        // We'll store startAt as a combination of date and time
        // Example date: 2024-03-24, time: 14:00
        startAt: new Date(`${data.date}T${data.time}:00`),
        endAt: new Date(`${data.date}T${data.time}:00`), // For simplistic demo, start == end
        status: 'SUBMITTED',
      }
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Rezervasyon kaydedilemedi." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Randevular alınamadı." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: "Durum güncellenemedi." }, { status: 500 });
  }
}
