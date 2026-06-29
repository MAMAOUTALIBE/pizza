import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import type { BuiltOrder } from "@/lib/orders";
import type { OrderStatus } from "@/lib/admin/types";

/**
 * Persistance des commandes (Prisma).
 * Toutes les fonctions sont **sans effet** si la persistance est désactivée
 * (mode démo) et **ne lèvent jamais** : un échec DB est journalisé mais ne fait
 * pas échouer le tunnel de commande. Quand une vraie base est branchée
 * (PERSIST_ORDERS="true" + DATABASE_URL), elles écrivent réellement.
 */

/**
 * Crée la commande + ses lignes + un paiement (en attente).
 * `online` distingue paiement carte en ligne (Stripe) vs sur place.
 */
export async function createOrder(order: BuiltOrder, online: boolean): Promise<void> {
  if (!isPersistenceEnabled()) {
    console.info("[db démo] Commande non persistée", { orderNumber: order.orderNumber });
    return;
  }
  try {
    await getPrisma().order.create({
      data: {
        number: order.orderNumber,
        channel: order.channel,
        status: "NEW",
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        deliveryAddress: order.customer.address || null,
        customerNote: order.customer.note || null,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        items: {
          create: order.items.map((item) => ({
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.total,
          })),
        },
        payment: {
          create: {
            method: online ? "CARD_ONLINE" : "CASH",
            status: "PENDING",
            amount: order.total,
          },
        },
      },
    });
  } catch (error) {
    console.error("Persistance de la commande échouée", order.orderNumber, error);
  }
}

/**
 * Marque une commande comme payée (après confirmation Stripe).
 * Idempotent côté DB (update sur un numéro unique).
 */
export async function markOrderPaid(orderNumber: string, stripeId?: string): Promise<void> {
  if (!isPersistenceEnabled()) return;
  try {
    await getPrisma().order.update({
      where: { number: orderNumber },
      data: {
        status: "CONFIRMED",
        payment: {
          update: { status: "PAID", paidAt: new Date(), stripeId: stripeId ?? null },
        },
      },
    });
  } catch (error) {
    console.error("Mise à jour du paiement échouée", orderNumber, error);
  }
}

/**
 * Change le statut d'une commande + trace un événement de statut et une entrée
 * de journal d'activité. Sans persistance → no-op (renvoie false).
 * `actor` identifie l'utilisateur admin à l'origine du changement.
 */
export async function setOrderStatus(
  orderId: string,
  status: OrderStatus,
  actor: { email: string; name: string },
): Promise<boolean> {
  if (!isPersistenceEnabled()) return false;
  try {
    const prisma = getPrisma();
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status, statusEvents: { create: { status } } },
    });
    // userId laissé nul (l'auth de démo n'a pas d'utilisateur en base) ;
    // l'acteur est tracé dans meta. En prod avec users en base : renseigner userId.
    await prisma.activityLog.create({
      data: {
        action: "order.status.update",
        entity: "Order",
        entityId: orderId,
        meta: { number: order.number, status, by: actor.email, byName: actor.name },
      },
    });
    return true;
  } catch (error) {
    console.error("Changement de statut échoué", orderId, error);
    return false;
  }
}

export interface OrderTracking {
  found: boolean;
  demo?: boolean;
  mismatch?: boolean;
  number?: string;
  status?: string;
  channel?: string;
  total?: number;
  createdAt?: string;
}

const digitsOnly = (s: string) => s.replace(/\D/g, "");

/**
 * Suivi public d'une commande par numéro — CONFIDENTIALITÉ : le statut n'est
 * renvoyé que si le téléphone fourni correspond à celui de la commande (anti
 * énumération). Sans persistance (démo), renvoie { demo: true }.
 */
export async function getOrderTracking(
  orderNumber: string,
  phone: string,
): Promise<OrderTracking> {
  if (!isPersistenceEnabled()) return { found: false, demo: true };
  try {
    const order = await getPrisma().order.findUnique({
      where: { number: orderNumber.trim() },
      select: {
        number: true,
        status: true,
        channel: true,
        total: true,
        customerPhone: true,
        createdAt: true,
      },
    });
    if (!order) return { found: false };
    if (!digitsOnly(phone) || digitsOnly(order.customerPhone) !== digitsOnly(phone)) {
      return { found: false, mismatch: true };
    }
    return {
      found: true,
      number: order.number,
      status: order.status,
      channel: order.channel,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Suivi de commande échoué", orderNumber, error);
    return { found: false };
  }
}

/**
 * Enregistre l'id d'un événement webhook pour garantir l'idempotence.
 * Renvoie `true` s'il faut traiter l'événement (première fois), `false` si déjà vu.
 * Sans persistance, renvoie toujours `true` (pas de déduplication possible).
 */
export async function recordWebhookEvent(eventId: string, type: string): Promise<boolean> {
  if (!isPersistenceEnabled()) return true;
  try {
    await getPrisma().processedWebhookEvent.create({ data: { id: eventId, type } });
    return true; // création réussie → jamais vu → traiter
  } catch {
    // Conflit de clé unique = déjà traité → ignorer (rejeu Stripe).
    return false;
  }
}
