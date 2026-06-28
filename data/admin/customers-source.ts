import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { customers as mockCustomers, orders as mockOrders } from "@/data/admin/mock";
import { mapAdminOrder, type PrismaOrderRow } from "@/data/admin/orders-source";
import type { Customer, Order } from "@/lib/admin/types";

/**
 * Source des clients du back-office (même patron que orders-source).
 * Persistance active → agrégats calculés depuis Prisma ; sinon repli mock.
 */

const num = (v: unknown): number => Number(v ?? 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

type PrismaCustomerRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  tags: string[];
  allergies: string | null;
  marketingOptIn: boolean;
  smsOptIn: boolean;
  createdAt: Date;
  orders: Array<{ total: unknown; createdAt: Date }>;
  loyaltyAccount: { points: number } | null;
};

function mapCustomer(c: PrismaCustomerRow): Customer {
  const totals = c.orders.map((o) => num(o.total));
  const ordersCount = c.orders.length;
  const totalSpent = round2(totals.reduce((s, t) => s + t, 0));
  const lastOrderAt = c.orders.reduce<Date | null>(
    (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
    null,
  );
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email ?? "",
    phone: c.phone,
    tags: c.tags,
    ordersCount,
    totalSpent,
    avgBasket: ordersCount ? round2(totalSpent / ordersCount) : 0,
    lastOrderAt: lastOrderAt ? lastOrderAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    allergies: c.allergies ?? undefined,
    marketingOptIn: c.marketingOptIn,
    smsOptIn: c.smsOptIn,
    loyaltyPoints: c.loyaltyAccount?.points ?? 0,
  };
}

/** Liste des clients (réels si persistance active, sinon mock). */
export async function getAdminCustomers(): Promise<{ customers: Customer[]; live: boolean }> {
  if (!isPersistenceEnabled()) return { customers: mockCustomers, live: false };
  try {
    const rows = await getPrisma().customer.findMany({
      include: {
        orders: { select: { total: true, createdAt: true } },
        loyaltyAccount: { select: { points: true } },
      },
      take: 500,
    });
    return { customers: rows.map((r) => mapCustomer(r as unknown as PrismaCustomerRow)), live: true };
  } catch (error) {
    console.error("Lecture des clients en base échouée — repli sur les mocks", error);
    return { customers: mockCustomers, live: false };
  }
}

/** Détail d'un client + ses dernières commandes. */
export async function getAdminCustomerById(
  id: string,
): Promise<{ customer: Customer | undefined; orders: Order[]; live: boolean }> {
  if (!isPersistenceEnabled()) {
    const customer = mockCustomers.find((c) => c.id === id);
    const orders = customer
      ? mockOrders.filter((o) => o.customerPhone === customer.phone).slice(0, 8)
      : [];
    return { customer, orders, live: false };
  }
  try {
    const row = await getPrisma().customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true, payment: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        },
        loyaltyAccount: { select: { points: true } },
      },
    });
    if (!row) return { customer: undefined, orders: [], live: true };
    const customer = mapCustomer(row as unknown as PrismaCustomerRow);
    const orders = (row.orders as unknown as PrismaOrderRow[]).map(mapAdminOrder);
    return { customer, orders, live: true };
  } catch (error) {
    console.error("Lecture du client en base échouée — repli sur les mocks", error);
    const customer = mockCustomers.find((c) => c.id === id);
    const orders = customer
      ? mockOrders.filter((o) => o.customerPhone === customer.phone).slice(0, 8)
      : [];
    return { customer, orders, live: false };
  }
}
