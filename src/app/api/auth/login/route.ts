import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aksel_clean_secret_key_change_me_in_prod"
);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Sistem yapılandırma hatası. Yönetici şifresi tanımlanmamış." },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      // getSession()'ın beklediği formatta imzalı JWT üret
      const token = await new SignJWT({
        id: "admin",
        email: "admin@zindetemizlik.local",
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
