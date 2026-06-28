import type { NextRequest } from "next/server";
import { requireSession, ok } from "@/lib/admin/api";
import { orders } from "@/data/admin/mock";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/orders — liste filtrable des commandes.
 * Query : ?status=PREPARING&channel=DELIVERY&q=martin
 * Accessible aux rôles opérationnels.
 */
export async function GET(request: NextRequest) {
  const auth = await requireSession(["SUPER_ADMIN", "MANAGER", "KITCHEN", "SUPPORT"]);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const channel = searchParams.get("channel");
  const q = searchParams.get("q")?.toLowerCase();

  let result = orders;
  if (status) result = result.filter((o) => o.status === status);
  if (channel) result = result.filter((o) => o.channel === channel);
  if (q) result = result.filter((o) => `${o.number} ${o.customerName} ${o.customerPhone}`.toLowerCase().includes(q));

  return ok({ orders: result, total: result.length });
}

/**
 * POST /api/admin/orders — création de commande (squelette).
 * Valide les champs requis puis (en prod) persiste via Prisma + journalise.
 */
export async function POST(request: NextRequest) {
  const auth = await requireSession(["SUPER_ADMIN", "MANAGER", "SUPPORT"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return ok({ error: "Articles requis" }, { status: 400 });
  }

  // TODO: créer la commande en base (Prisma), générer le numéro, journaliser.
  return ok({ created: true, by: auth.session.email }, { status: 201 });
}
