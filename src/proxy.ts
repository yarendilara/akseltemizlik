import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Login Page is public context
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. Cookie check for Admin sessions
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');
    
    // Very simple check for this verification stage
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle other roles session mock for Faz 2 preview
  const cleanerSession = request.cookies.get('cleaner_session');
  if (pathname.startsWith('/temizlikci') && !cleanerSession) {
    // For now allow for local testing if needed, or redirect
    // return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/temizlikci/:path*',
    '/musteri/:path*',
  ],
};
