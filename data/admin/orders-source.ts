import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { orders as mockOrders } from "@/data/admin/mock";
import type { Order, OrderChannel, OrderStatus, PaymentStatus, PaymentMethod } from "@/lib/admin/types";

/**
 * Source des commandes du back-office.
 *
 * Démonstration du patron de migration mock → Prisma : quand la persistance est
 * active (PERSIST_ORDERS + DATABASE_URL), on lit les VRAIES commandes web en
 * base ; sinon (ou si la base est injoignable), on retombe sur les données
 * mockées — l'UI reste identique. Tous les autres modules suivront ce patron.
 */

// Type minimal de la commande Prisma lue (items + paiement inclus).
export type PrismaOrderRow = {
  id: string;
  number: string;
  channel: string;
  status: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  customerNote: string | null;
  subtotal: unknown;
  deliveryFee: unknown;
  discount: unknown;
  total: unknown;
  createdAt: Date;
  items: Array<{ name: string; quantity: number; unitPrice: unknown }>;
  payment: { status: string; method: string } | null;
};

const num = (v: unknown): number => Number(v ?? 0);

/** Mappe une commande Prisma (items + paiement) vers le type admin. */
export function mapAdminOrder(o: PrismaOrderRow): Order {
  return {
    id: o.id,
    number: o.number,
    channel: o.channel as OrderChannel,
    status: o.status as OrderStatus,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    address: o.deliveryAddress ?? undefined,
    items: o.items.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      unitPrice: num(it.unitPrice),
      options: [],
    })),
    subtotal: num(o.subtotal),
    deliveryFee: num(o.deliveryFee),
    discount: num(o.discount),
    total: num(o.total),
    paymentStatus: (o.payment?.status ?? "PENDING") as PaymentStatus,
    paymentMethod: (o.payment?.method ?? "CARD_ONLINE") as PaymentMethod,
    customerNote: o.customerNote ?? undefined,
    createdAt: o.createdAt.toISOString(),
    prepMinutes: 20,
  };
}

/** Liste des commandes (réelles si persistance active, sinon mock). */
export async function getAdminOrders(): Promise<{ orders: Order[]; live: boolean }> {
  if (!isPersistenceEnabled()) return { orders: mockOrders, live: false };
  try {
    const rows = await getPrisma().order.findMany({
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { orders: rows.map((r) => mapAdminOrder(r as unknown as PrismaOrderRow)), live: true };
  } catch (error) {
    console.error("Lecture des commandes en base échouée — repli sur les mocks", error);
    return { orders: mockOrders, live: false };
  }
}

/** Détail d'une commande par id (réelle ou mock). */
export async function getAdminOrderById(
  id: string,
): Promise<{ order: Order | undefined; live: boolean }> {
  if (!isPersistenceEnabled()) {
    return { order: mockOrders.find((o) => o.id === id), live: false };
  }
  try {
    const row = await getPrisma().order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
    return { order: row ? mapAdminOrder(row as unknown as PrismaOrderRow) : undefined, live: true };
  } catch (error) {
    console.error("Lecture de la commande en base échouée — repli sur les mocks", error);
    return { order: mockOrders.find((o) => o.id === id), live: false };
  }
}
