/**
 * Calculs analytiques du dashboard.
 *
 * `computeAnalytics(orders, customers, reservations, now)` est PUR : il dérive
 * tous les KPIs et séries d'un jeu de données + une date de référence. Le
 * dashboard l'appelle avec les VRAIES données (Prisma) quand la persistance est
 * active, sinon avec les mocks. Les exports nommés en bas restent calculés sur
 * les mocks pour la page Rapports (inchangée).
 */
import {
  orders as mockOrders,
  customers as mockCustomers,
  reservations as mockReservations,
  products,
  NOW,
} from "@/data/admin/mock";
import type { Order, Customer, Reservation, OrderChannel } from "@/lib/admin/types";

export interface Point {
  label: string;
  value: number;
}

export interface DashboardAnalytics {
  kpis: {
    revenueToday: number;
    revenueMonth: number;
    ordersToday: number;
    pending: number;
    preparing: number;
    delivered: number;
    avgBasket: number;
    newCustomers: number;
    reservationsToday: number;
    cancelRate: number;
  };
  revenueSeries: Point[];
  ordersSeries: Point[];
  channelSplit: Point[];
  hourlySeries: Point[];
  topProducts: Point[];
}

const isCancelled = (s: string) => s === "CANCELLED" || s === "REFUNDED";
const sameDay = (iso: string, ref: Date) => new Date(iso).toDateString() === ref.toDateString();
const sameMonth = (iso: string, ref: Date) => {
  const d = new Date(iso);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
};

export function computeAnalytics(
  orders: Order[],
  customers: Customer[],
  reservations: Reservation[],
  now: Date,
): DashboardAnalytics {
  const valid = orders.filter((o) => !isCancelled(o.status));
  const today = orders.filter((o) => sameDay(o.createdAt, now));
  const todayValid = today.filter((o) => !isCancelled(o.status));
  const month = valid.filter((o) => sameMonth(o.createdAt, now));

  const revenueToday = todayValid.reduce((s, o) => s + o.total, 0);
  const revenueMonth = month.reduce((s, o) => s + o.total, 0);
  const countBy = (status: string) => today.filter((o) => o.status === status).length;

  const kpis = {
    revenueToday,
    revenueMonth,
    ordersToday: today.length,
    pending: countBy("NEW") + countBy("CONFIRMED"),
    preparing: countBy("PREPARING") + countBy("READY"),
    delivered: today.filter((o) => o.status === "DELIVERED" || o.status === "PICKED_UP").length,
    avgBasket: month.length ? revenueMonth / month.length : 0,
    newCustomers: customers.filter((c) => sameMonth(c.createdAt, now)).length,
    reservationsToday: reservations.filter((r) => sameDay(r.date, now)).length,
    cancelRate: orders.length
      ? (orders.filter((o) => o.status === "CANCELLED").length / orders.length) * 100
      : 0,
  };

  // CA des 14 derniers jours.
  const revenueSeries: Point[] = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * 86400000);
    const total = valid.filter((o) => sameDay(o.createdAt, day)).reduce((s, o) => s + o.total, 0);
    return { label: day.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), value: Math.round(total) };
  });

  // Nombre de commandes par jour (14 j).
  const ordersSeries: Point[] = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * 86400000);
    return { label: day.toLocaleDateString("fr-FR", { weekday: "short" }), value: orders.filter((o) => sameDay(o.createdAt, day)).length };
  });

  // Répartition par canal.
  const labels: Record<OrderChannel, string> = {
    DELIVERY: "Livraison",
    PICKUP: "À emporter",
    DINE_IN: "Sur place",
    QR_TABLE: "QR à table",
  };
  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.channel] = (acc[o.channel] ?? 0) + 1;
    return acc;
  }, {});
  const channelSplit: Point[] = (Object.keys(labels) as OrderChannel[]).map((key) => ({
    label: labels[key],
    value: counts[key] ?? 0,
  }));

  // Heures les plus actives (11h–23h).
  const buckets: Record<number, number> = {};
  for (let h = 11; h <= 23; h++) buckets[h] = 0;
  orders.forEach((o) => {
    const h = new Date(o.createdAt).getHours();
    if (h >= 11 && h <= 23) buckets[h]++;
  });
  const hourlySeries: Point[] = Object.entries(buckets).map(([h, value]) => ({ label: `${h}h`, value }));

  // Top produits par quantité réellement commandée (sur les articles).
  const qtyByName = new Map<string, number>();
  orders.forEach((o) =>
    o.items.forEach((it) => qtyByName.set(it.name, (qtyByName.get(it.name) ?? 0) + it.quantity)),
  );
  const topProducts: Point[] = [...qtyByName.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return { kpis, revenueSeries, ordersSeries, channelSplit, hourlySeries, topProducts };
}

// --- Exports mock (page Rapports, inchangée) ---
const mock = computeAnalytics(mockOrders, mockCustomers, mockReservations, NOW);
export const kpis = mock.kpis;
export const revenueSeries = mock.revenueSeries;
export const ordersSeries = mock.ordersSeries;
export const channelSplit = mock.channelSplit;
export const hourlySeries = mock.hourlySeries;

// Top produits par catalogue (soldCount) — conservé tel quel pour Rapports.
export const topProducts: Point[] = [...products]
  .sort((a, b) => b.soldCount - a.soldCount)
  .slice(0, 5)
  .map((p) => ({ label: p.name, value: p.soldCount }));
