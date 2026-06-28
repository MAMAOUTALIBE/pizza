import { cookies } from "next/headers";
import crypto from "node:crypto";
import type { UserRole } from "@/lib/admin/types";
import { SESSION_COOKIE } from "@/lib/admin/constants";

export { SESSION_COOKIE };

/**
 * Authentification du back-office.
 *
 * Implémentation : session signée (HMAC-SHA256) stockée dans un cookie httpOnly.
 * Les comptes de démonstration sont en dur et documentés. En production :
 * remplacer DEMO_ACCOUNTS par une vérification Prisma + bcrypt, et garder le
 * reste (signature, cookie, getSession) tel quel.
 */

const MAX_AGE = 60 * 60 * 8; // 8 heures

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Comptes de démonstration (un par rôle). Mot de passe : « demo ». */
export const DEMO_ACCOUNTS: Array<Session & { password: string }> = [
  { userId: "u1", name: "Giovanni Bianchi", email: "superadmin@labella.fr", role: "SUPER_ADMIN", password: "demo" },
  { userId: "u2", name: "Sofia Marchetti", email: "manager@labella.fr", role: "MANAGER", password: "demo" },
  { userId: "u3", name: "Karim Benali", email: "cuisine@labella.fr", role: "KITCHEN", password: "demo" },
  { userId: "u4", name: "Lucas Petit", email: "livreur@labella.fr", role: "DRIVER", password: "demo" },
  { userId: "u5", name: "Emma Laurent", email: "support@labella.fr", role: "SUPPORT", password: "demo" },
];

function secret() {
  return process.env.AUTH_SECRET || "dev-only-insecure-secret";
}

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString("base64url");

/** Crée un jeton de session signé. */
export function createSessionToken(session: Session): string {
  const payload = b64url(JSON.stringify({ ...session, exp: Date.now() + MAX_AGE * 1000 }));
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Vérifie un jeton et renvoie la session, ou null si invalide/expiré. */
export function verifySessionToken(token: string | undefined): Session | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  // Comparaison à temps constant
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { userId: data.userId, name: data.name, email: data.email, role: data.role };
  } catch {
    return null;
  }
}

/** Récupère la session courante côté serveur (Server Components / actions). */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Vérifie une combinaison email / mot de passe contre les comptes démo. */
export function authenticate(email: string, password: string): Session | null {
  const acc = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  if (!acc) return null;
  return { userId: acc.userId, name: acc.name, email: acc.email, role: acc.role };
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
