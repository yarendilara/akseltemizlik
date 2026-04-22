import { UserRole } from "@/types";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aksel_clean_secret_key_change_me_in_prod"
);

export interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * 1. Oturum Bilgisini Sunucudan Çeker (JWT Verifiy).
 */
export async function getSession(): Promise<Session | null> {
  const authCookie = (await cookies()).get("auth_session");
  
  if (!authCookie || !authCookie.value) return null;

  try {
    const { payload } = await jwtVerify(authCookie.value, JWT_SECRET);
    
    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as UserRole
      }
    };
  } catch (err) {
    console.error("[AUTH] Invalid session or JWT expired.");
    return null;
  }
}

/**
 * 2. RBAC Zorunluluğu ve Güvenlik Sıkılaştırma.
 */
export async function requireRole(role: UserRole): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapınız.");
  }
  
  // Admin bypass
  if (session.user.role === "ADMIN") return session;
  
  if (session.user.role !== role) {
    throw new Error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
  }

  return session;
}
