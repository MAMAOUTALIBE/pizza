import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildOrder } from "@/lib/orders";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createOrder } from "@/lib/orders-repo";
import { sendOrderConfirmation } from "@/lib/email";

/**
 * POST /api/orders — commande payée sur place / à la livraison (sans paiement
 * en ligne). Validation + tarification partagées avec le tunnel Stripe
 * (cf. lib/orders.ts) pour éviter toute divergence de prix.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`orders:${clientIp(request)}`, 10, 60_000);
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

  // Persiste la commande (sans effet en mode démo) — réglée à la remise.
  await createOrder(order, false);

  // Email de confirmation si le client a fourni une adresse (sinon ignoré).
  await sendOrderConfirmation({
    order: {
      orderNumber: order.orderNumber,
      total: order.total,
      etaMinutes: order.etaMinutes,
      customer: { name: order.customer.name, email: order.customer.email },
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, total: i.total })),
    },
    paid: false,
  });

  console.info("Public order received", {
    orderNumber: order.orderNumber,
    channel: order.channel,
    customerPhone: order.customer.phone,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.total,
  });

  return NextResponse.json(
    { data: { ...order, paymentStatus: "PAY_ON_SITE" } },
    { status: 201 },
  );
}
