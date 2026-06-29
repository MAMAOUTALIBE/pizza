import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildOrder } from "@/lib/orders";
import { createCheckoutSession } from "@/lib/checkout";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createOrder } from "@/lib/orders-repo";

/**
 * POST /api/checkout — démarre le paiement en ligne (carte) d'une commande.
 *
 * Flux : valide le panier + le client (prix recalculés serveur) puis crée une
 * Stripe Checkout Session et renvoie l'URL de redirection. Sans clé Stripe,
 * bascule en mode démo (confirmation simulée) pour tester le tunnel en local.
 */
export async function POST(request: NextRequest) {
  // Anti-abus : limite les démarrages de paiement par IP.
  const limit = rateLimit(`checkout:${clientIp(request)}`, 8, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);

  const result = buildOrder(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const order = result.order;

  // Persiste la commande en attente de paiement (sans effet en mode démo).
  // Le webhook la passera à « payée » après confirmation Stripe.
  await createOrder(order, true);

  // URL de base : privilégier la variable d'env (fiable) ; à défaut, l'origine
  // de la requête (à fixer en prod via NEXT_PUBLIC_SITE_URL — l'en-tête Host
  // étant manipulable).
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  try {
    const { url, demo } = await createCheckoutSession(order, baseUrl);
    return NextResponse.json(demo ? { url, demo: true } : { url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible. Réessayez." },
      { status: 502 },
    );
  }
}
