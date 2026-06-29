import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import type { BuiltOrder } from "@/lib/orders";

/**
 * Création d'une session de paiement, partagée entre la route /api/checkout et
 * l'assistant IA (outil create_checkout). Sans clé Stripe → mode démo (URL de
 * confirmation simulée) pour tester le tunnel en local.
 */

export interface CheckoutResult {
  url: string;
  demo: boolean;
}

const toCents = (amount: number) => Math.round(amount * 100);

/** Tronque une valeur de métadonnée à la limite Stripe (500 caractères). */
const meta = (value: string) => value.slice(0, 500);

export async function createCheckoutSession(
  order: BuiltOrder,
  baseUrl: string,
): Promise<CheckoutResult> {
  // --- Mode démo : pas de clé Stripe → paiement simulé ---
  if (!isStripeConfigured()) {
    const params = new URLSearchParams({
      demo: "1",
      order: order.orderNumber,
      total: order.total.toFixed(2),
      eta: String(order.etaMinutes),
    });
    return { url: `${baseUrl}/commander/confirmation?${params.toString()}`, demo: true };
  }

  // --- Mode réel : Stripe Checkout Session ---
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

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    locale: "fr",
    customer_email: order.customer.email || undefined,
    success_url: `${baseUrl}/commander/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/commander?canceled=1`,
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

  if (!session.url) throw new Error("Session de paiement invalide.");
  return { url: session.url, demo: false };
}
