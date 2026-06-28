import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/constants";

type AdminRole = "SUPER_ADMIN" | "MANAGER" | "KITCHEN" | "DRIVER" | "SUPPORT";

interface MiddlewareSession {
  role: AdminRole;
  exp: number;
}

const roleRules: Array<{ href: string; roles?: AdminRole[] }> = [
  { href: "/admin/cuisine", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
  { href: "/admin/commandes", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN", "SUPPORT"] },
  { href: "/admin/reservations", roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
  { href: "/admin/livraisons", roles: ["SUPER_ADMIN", "MANAGER", "DRIVER"] },
  { href: "/admin/paiements", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/produits", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
  { href: "/admin/menus", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/categories", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/options", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/stocks", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
  { href: "/admin/clients", roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
  { href: "/admin/avis", roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
  { href: "/admin/fidelite", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/marketing", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/site", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/medias", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/ia", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/rapports", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/utilisateurs", roles: ["SUPER_ADMIN"] },
  { href: "/admin/parametres", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/logs", roles: ["SUPER_ADMIN"] },
];

/**
 * Protection des routes back-office.
 * Vérifie la signature, l'expiration et les droits du cookie de session avant
 * que la page demandee ne soit rendue par l'App Router.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La page de login reste publique.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessAdminPath(pathname, session.role)) {
    const deniedUrl = new URL("/admin/acces-refuse", request.url);
    deniedUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(deniedUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Applique le middleware à tout l'espace /admin.
  matcher: ["/admin/:path*"],
};

function secret() {
  return process.env.AUTH_SECRET || "dev-only-insecure-secret";
}

async function verifySessionToken(token: string | undefined): Promise<MiddlewareSession | null> {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = await sign(payload);
  if (sig !== expected) return null;

  try {
    const data = JSON.parse(decodeBase64Url(payload)) as Partial<MiddlewareSession>;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (!isAdminRole(data.role)) return null;
    return { role: data.role, exp: data.exp };
  } catch {
    return null;
  }
}

async function sign(payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return encodeBase64Url(new Uint8Array(signature));
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isAdminRole(role: unknown): role is AdminRole {
  return (
    role === "SUPER_ADMIN" ||
    role === "MANAGER" ||
    role === "KITCHEN" ||
    role === "DRIVER" ||
    role === "SUPPORT"
  );
}

function canAccessAdminPath(pathname: string, role: AdminRole) {
  if (pathname === "/admin" || pathname === "/admin/acces-refuse") return true;
  const match = roleRules
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return !match?.roles || match.roles.includes(role);
}
