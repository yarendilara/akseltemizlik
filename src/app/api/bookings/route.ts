import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

import { NotificationService } from '@/lib/notifications';

export async function POST(request: Request) {
  // Rate Limiting (3 per hour)
  const clientIp = (await headers()).get('x-forwarded-for') || 'unknown';
  const rl = await rateLimit(`booking:${clientIp}`, 3, 3600);
  if (!rl.success) {
    return NextResponse.json({ error: "Çok fazla rezervasyon denemesi yaptınız. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    const data = await request.json();
    
    // Convert 10-digit phone to standard format if needed
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');

    const booking = await prisma.booking.create({
      data: {
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email,
        serviceId: data.serviceId,
        districtId: data.district,
        address: data.address,
        notes: data.notes || "",
        startAt: new Date(`${data.date}T${data.time}:00`),
        endAt: new Date(`${data.date}T${data.time}:00`), 
        status: 'SUBMITTED',
      }
    });

    // 4. Send Notifications
    await NotificationService.notifyBookingReceived(booking);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error: any) {
    console.error("Booking Error:", error);
    const msg = error?.message || error?.error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return NextResponse.json({ error: "Rezervasyon kaydedilemedi. Detay: " + msg }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    let bookings;
    if (ids) {
      const idArray = ids.split(',');
      bookings = await prisma.booking.findMany({
        where: { id: { in: idArray } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
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
