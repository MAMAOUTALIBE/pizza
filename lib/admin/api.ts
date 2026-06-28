import { NextResponse } from "next/server";
import { getSession, type Session } from "@/lib/admin/auth";
import type { UserRole } from "@/lib/admin/types";

/**
 * Helpers pour les route handlers du back-office.
 * Pattern : chaque route /api/admin/* commence par requireSession() pour
 * vérifier l'authentification (et éventuellement le rôle), puis valide les
 * données avant de répondre en JSON.
 */

export type ApiResult<T> = { session: Session; data?: T } | { response: NextResponse };

/** Vérifie la session et (optionnellement) le rôle. Renvoie une 401/403 sinon. */
export async function requireSession(roles?: UserRole[]): Promise<
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }
  if (roles && !roles.includes(session.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Accès refusé" }, { status: 403 }),
    };
  }
  return { ok: true, session };
}

/** Réponse JSON de succès standardisée. */
export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

/** Réponse JSON d'erreur standardisée. */
export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
