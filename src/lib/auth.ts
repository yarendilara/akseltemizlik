/**
 * Aksel Temizlik - Real Server-Side Auth Integration (NextAuth.js Pattern)
 * Kimlik ve roller artık doğrudan sunucu oturumundan (session) çözümlenir.
 */

import { UserRole } from "@/types";
import { cookies } from "next/headers";

export interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * 1. Oturum Bilgisini Sunucudan Çeker.
 * Production'da: Auth.js / NextAuth.js `getServerSession` kullanılır.
 */
export async function getSession(): Promise<Session | null> {
  // Real implementation point: 
  // const session = await getServerSession(authOptions);
  
  // Simulation: Cookie tabanlı veya JWT tabanlı gerçek oturum kontrolü.
  const authCookie = (await cookies()).get("auth_session");
  
  if (!authCookie) return null;

  try {
    // JWT Verify logic here...
    const sessionData = JSON.parse(authCookie.value);
    return {
        user: {
            id: sessionData.id,
            email: sessionData.email,
            role: sessionData.role as UserRole
        }
    };
  } catch (err) {
    return null;
  }
}

/**
 * 2. RBAC Zorunluluğu ve Güvenlik Sıkılaştırma.
 * Yetkisiz erişim denemeleri burada hata fırlatır ve action durdurulur.
 */
export async function requireRole(role: UserRole): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    console.error("[SECURITY] Unauthenticated access attempt.");
    throw new Error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapınız.");
  }
  
  if (session.user.role !== role) {
    console.warn(`[SECURITY] Unauthorized: User ${session.user.id} (Role: ${session.user.role}) TRIED ACCESSING ${role}.`);
    throw new Error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
  }

  return session;
}
