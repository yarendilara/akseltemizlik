import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aksel_clean_secret_key_change_me_in_prod"
);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // 1. Find the admin user in DB
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AkselAdmin2024!";

    // 2. Auto-Seed Logic for First Run
    if (!adminUser && password === ADMIN_PASSWORD) {
      console.log("Admin not found, auto-seeding with ADMIN_PASSWORD...");
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      adminUser = await prisma.user.create({
        data: {
          email: "admin@zindetemizlik.local",
          passwordHash: hashedPassword,
          role: "ADMIN",
        }
      });
    }

    if (!adminUser) {
      return NextResponse.json({ error: "Sistemde admin bulunamadı ve şifre eşleşmedi." }, { status: 401 });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);

    if (isMatch) {
      const token = await new SignJWT({
        id: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      const cookieStore = await cookies();
      // Guard'ın (lib/auth.ts) baktığı cookie adı: auth_session
      cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      // Middleware/proxy hâlâ admin_session'a bakıyorsa geriye dönük uyumluluk
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Hatalı parola." }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
