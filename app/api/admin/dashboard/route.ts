import { requireSession, ok } from "@/lib/admin/api";
import { kpis, revenueSeries, channelSplit, topProducts } from "@/data/admin/analytics";

// Données dynamiques (dépendent de la session).
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/dashboard — KPIs et séries du tableau de bord.
 * Exemple de route sécurisée : vérifie la session avant de répondre.
 * En production, remplacer les imports mock par des agrégations Prisma.
 */
export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  return ok({ kpis, revenueSeries, channelSplit, topProducts });
}
