import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aksel_clean_secret_key_change_me_in_prod"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Public Paths (Login etc)
  if (pathname === '/admin/login' || pathname === '/temizlikci/login') {
    return NextResponse.next();
  }

  // 2. Admin Protection
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. Cleaner/Customer Logic (Optional for now)
  // ...

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/temizlikci/:path*',
    '/musteri/:path*',
  ],
};
