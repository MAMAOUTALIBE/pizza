import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { buildOrder } from "@/lib/orders";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
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

  // --- Mode démo : pas de clé Stripe → on simule un paiement réussi ---
  if (!isStripeConfigured()) {
    const params = new URLSearchParams({
      demo: "1",
      order: order.orderNumber,
      total: order.total.toFixed(2),
      eta: String(order.etaMinutes),
    });
    return NextResponse.json({
      url: `${baseUrl}/commander/confirmation?${params.toString()}`,
      demo: true,
    });
  }

  // --- Mode réel : Stripe Checkout Session ---
  const toCents = (amount: number) => Math.round(amount * 100);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "eur",
      unit_amount: toCents(item.unitPrice),
      product_data: { name: `Pizza ${item.name}` },
    },
  }));

  if (order.deliveryFee > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: toCents(order.deliveryFee),
        product_data: { name: "Frais de livraison" },
      },
    });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      locale: "fr",
      customer_email: order.customer.email || undefined,
      success_url: `${baseUrl}/commander/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/commander?canceled=1`,
      // Métadonnées exploitées par le webhook pour enregistrer la commande.
      // Stripe limite chaque valeur à 500 caractères → on tronque par sécurité.
      metadata: {
        orderNumber: order.orderNumber,
        channel: order.channel,
        customerName: meta(order.customer.name),
        customerPhone: meta(order.customer.phone),
        address: meta(order.customer.address),
        note: meta(order.customer.note),
      },
      payment_intent_data: {
        metadata: { orderNumber: order.orderNumber, channel: order.channel },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session de paiement invalide." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible. Réessayez." },
      { status: 502 },
    );
  }
}

/** Tronque une valeur de métadonnée à la limite Stripe (500 caractères). */
function meta(value: string): string {
  return value.slice(0, 500);
}
