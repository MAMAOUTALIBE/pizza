import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/lib/admin/types";
import { SESSION_COOKIE } from "@/lib/admin/constants";
import { getPrisma, isPersistenceEnabled } from "@/lib/db";

export { SESSION_COOKIE };

/**
 * Authentification du back-office.
 *
 * Session signée (HMAC-SHA256) en cookie httpOnly. Deux sources d'identité :
 * 1) Utilisateurs réels en base (Prisma) vérifiés par bcrypt — quand la
 *    persistance est active (production).
 * 2) Comptes de démonstration — UNIQUEMENT hors production (ou opt-in explicite
 *    ALLOW_DEMO_LOGIN), jamais exposés sur un site live.
 */

const MAX_AGE = 60 * 60 * 8; // 8 heures

/** Secrets faibles/exemples interdits en production. */
const WEAK_SECRETS = new Set([
  "change-me-in-production",
  "dev-only-secret-change-me",
  "dev-only-insecure-secret",
]);

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

/**
 * Secret de signature des sessions. FAIL-CLOSED en production : si AUTH_SECRET
 * est absent, trop court ou connu/faible, on lève une erreur (pas de fallback
 * forgeable). En dev, on tolère un secret de développement.
 */
function secret(): string {
  const s = process.env.AUTH_SECRET ?? "";
  if (process.env.NODE_ENV === "production") {
    if (s.length < 32 || WEAK_SECRETS.has(s)) {
      throw new Error(
        "AUTH_SECRET invalide en production : fournissez un secret fort et unique (openssl rand -base64 32).",
      );
    }
    return s;
  }
  return s || "dev-insecure-secret-development-only";
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

/** Les comptes de démo sont-ils autorisés ? (jamais en prod sauf opt-in explicite). */
function demoLoginAllowed(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_LOGIN === "true";
}

/**
 * Vérifie email / mot de passe.
 * 1) Utilisateur réel en base (bcrypt) si la persistance est active.
 * 2) Sinon (ou en repli), comptes de démo — uniquement si autorisés.
 */
export async function authenticate(email: string, password: string): Promise<Session | null> {
  const normalized = email.trim().toLowerCase();

  // 1) Vrais utilisateurs en base
  if (isPersistenceEnabled()) {
    try {
      const user = await getPrisma().user.findUnique({ where: { email: normalized } });
      if (user && user.active && user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
        return { userId: user.id, name: user.name, email: user.email, role: user.role };
      }
    } catch (error) {
      console.error("Vérification utilisateur en base échouée", error);
    }
  }

  // 2) Comptes de démonstration (hors prod / opt-in)
  if (demoLoginAllowed()) {
    const acc = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized && a.password === password);
    if (acc) return { userId: acc.userId, name: acc.name, email: acc.email, role: acc.role };
  }

  return null;
}

/** Les comptes de démo peuvent-ils être affichés/pré-remplis sur le login ? */
export function isDemoVisible(): boolean {
  return demoLoginAllowed();
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
