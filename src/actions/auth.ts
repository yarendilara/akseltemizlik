"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

const COOKIE_NAME = "auth_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aksel_clean_secret_key_change_me_in_prod"
);

/**
 * 1. Secure Sign-In (Server Side)
 */
export async function signIn(email: string, password: string): Promise<{ success: boolean, error?: string }> {
  // Rate Limiting (5 attempts per hour per IP)
  const clientIp = (await headers()).get("x-forwarded-for") || "unknown";
  const rl = await rateLimit(`signin:${clientIp}`, 5, 3600);
  if (!rl.success) {
    return { success: false, error: "Çok fazla yanlış deneme yaptınız. Lütfen daha sonra tekrar deneyin." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return { success: false, error: "Geçersiz e-posta veya şifre." };

    // Şifre Doğrulama (Bcrypt)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return { success: false, error: "Geçersiz e-posta veya şifre." };

    // 2. Create Signed JWT
    const token = await new SignJWT({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 3. Set Http-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 Gün
    });

    return { success: true };
  } catch (error) {
    console.error("[AUTH] Sign-in error:", error);
    return { success: false, error: "Giriş yapılırken teknik bir hata oluştu." };
  }
}

/**
 * 4. Sign-Out
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}
