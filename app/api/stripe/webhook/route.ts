import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid, recordWebhookEvent } from "@/lib/orders-repo";
import { sendOrderConfirmation } from "@/lib/email";

// Le webhook a besoin du corps brut + de Node (crypto Stripe).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook — réception des événements Stripe.
 * Vérifie la signature avec STRIPE_WEBHOOK_SECRET puis traite le paiement.
 *
 * Production : sur `checkout.session.completed`, marquer la commande comme
 * payée en base (Prisma), journaliser, et envoyer la confirmation email/SMS.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook Stripe non configuré (STRIPE_WEBHOOK_SECRET)." },
      { status: 501 },
    );
  }
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  // Corps brut requis pour la vérification de signature.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Ne considérer la commande payée que si le paiement est réellement
      // abouti (les moyens asynchrones peuvent arriver en « unpaid » ici).
      if (session.payment_status !== "paid") {
        console.info("Session complétée mais non payée (en attente)", {
          orderNumber: session.metadata?.orderNumber,
          paymentStatus: session.payment_status,
        });
        break;
      }

      // Idempotence : ignore les rejeux du même événement (Stripe at-least-once).
      const fresh = await recordWebhookEvent(event.id, event.type);
      if (!fresh) {
        console.info("Événement webhook déjà traité, ignoré", { eventId: event.id });
        break;
      }

      await handlePaidSession(session);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("⏱️ Session de paiement expirée", { orderNumber: session.metadata?.orderNumber });
      break;
    }
    default:
      // Les autres événements sont acquittés sans traitement.
      break;
  }

  return NextResponse.json({ received: true });
}

/** Traite une session payée : marque la commande payée + envoie la confirmation. */
async function handlePaidSession(session: Stripe.Checkout.Session) {
  const orderNumber = session.metadata?.orderNumber ?? "—";
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : undefined;

  // Persiste l'état payé (sans effet en mode démo / sans DB).
  await markOrderPaid(orderNumber, paymentIntentId);

  const email = session.customer_details?.email ?? null;
  if (email) {
    // Reconstruit les articles (hors frais de livraison) pour l'email.
    let items: Array<{ name: string; quantity: number; total: number }> = [];
    try {
      const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
        limit: 50,
      });
      items = lineItems.data
        .filter((li) => li.description !== "Frais de livraison")
        .map((li) => ({
          name: (li.description ?? "Article").replace(/^Pizza /, ""),
          quantity: li.quantity ?? 1,
          total: (li.amount_total ?? 0) / 100,
        }));
    } catch (error) {
      console.error("Récupération des articles Stripe échouée", error);
    }

    await sendOrderConfirmation({
      order: {
        orderNumber,
        total: (session.amount_total ?? 0) / 100,
        etaMinutes: session.metadata?.channel === "DELIVERY" ? 30 : 20,
        customer: { name: session.metadata?.customerName ?? "client", email },
        items,
      },
      paid: true,
    });
  }

  console.info("✅ Paiement confirmé", { orderNumber, paymentStatus: session.payment_status });
}
