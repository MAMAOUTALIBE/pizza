import type Anthropic from "@anthropic-ai/sdk";
import { getAdminOrders } from "@/data/admin/orders-source";
import { getAdminCustomers } from "@/data/admin/customers-source";
import { getAdminReviews } from "@/data/admin/reviews-source";

/**
 * Outils du copilote staff (back-office) — LECTURE SEULE.
 * Ils s'appuient sur les sources admin existantes (Prisma en live, mock sinon),
 * donc le copilote fonctionne aussi en démo. Aucune écriture : pour modifier une
 * commande, le copilote renvoie vers la page admin concernée.
 */

const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const round2 = (n: number) => Math.round(n * 100) / 100;
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "PICKED_UP",
  "CANCELLED",
  "REFUNDED",
];
const OPEN_STATUSES = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];

export const STAFF_TOOLS: Anthropic.Tool[] = [
  {
    name: "dashboard_summary",
    description:
      "Synthèse de l'activité : commandes du jour, chiffre d'affaires du jour, commandes en cours, répartition par statut.",
    input_schema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "search_orders",
    description: "Recherche des commandes par statut et/ou texte (numéro, nom ou téléphone client).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ORDER_STATUSES, description: "Filtrer par statut." },
        query: { type: "string", description: "Numéro, nom ou téléphone." },
      },
    },
  },
  {
    name: "find_customer",
    description: "Trouve un client (nom, téléphone ou email) et renvoie son profil et son historique.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { query: { type: "string", description: "Nom, téléphone ou email." } },
      required: ["query"],
    },
  },
  {
    name: "recent_reviews",
    description:
      "Liste les avis clients récents (pour répondre ou analyser). Option : seulement ceux en attente de modération.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pending_only: { type: "boolean", description: "Seulement les avis en attente." },
        limit: { type: "integer", description: "Nombre maximum (défaut 8)." },
      },
    },
  },
];

async function dashboardSummary(): Promise<string> {
  const { orders, live } = await getAdminOrders();
  const now = new Date();
  const todays = orders.filter((o) => sameDay(new Date(o.createdAt), now));
  const byStatus: Record<string, number> = {};
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  return JSON.stringify({
    source: live ? "base" : "démo",
    ordersTotal: orders.length,
    ordersToday: todays.length,
    revenueToday: round2(todays.reduce((s, o) => s + o.total, 0)),
    inProgress: orders.filter((o) => OPEN_STATUSES.includes(o.status)).length,
    byStatus,
  });
}

async function searchOrders(input: { status?: unknown; query?: unknown }): Promise<string> {
  const { orders } = await getAdminOrders();
  const status = typeof input.status === "string" ? input.status.toUpperCase() : null;
  const q = typeof input.query === "string" && input.query.trim() ? fold(input.query) : null;
  const matches = orders
    .filter((o) => (!status || o.status === status) &&
      (!q || fold(`${o.number} ${o.customerName} ${o.customerPhone}`).includes(q)))
    .slice(0, 15)
    .map((o) => ({
      number: o.number,
      status: o.status,
      customer: o.customerName,
      phone: o.customerPhone,
      total: o.total,
      channel: o.channel,
      createdAt: o.createdAt,
    }));
  return JSON.stringify({ count: matches.length, orders: matches });
}

async function findCustomer(input: { query?: unknown }): Promise<string> {
  const q = typeof input.query === "string" ? fold(input.query) : "";
  if (!q) return JSON.stringify({ error: "Requête vide." });
  const { customers } = await getAdminCustomers();
  const matches = customers
    .filter((c) => fold(`${c.firstName} ${c.lastName} ${c.phone} ${c.email}`).includes(q))
    .slice(0, 8)
    .map((c) => ({
      name: `${c.firstName} ${c.lastName}`,
      phone: c.phone,
      email: c.email,
      ordersCount: c.ordersCount,
      totalSpent: c.totalSpent,
      avgBasket: c.avgBasket,
      lastOrderAt: c.lastOrderAt,
      tags: c.tags,
      allergies: c.allergies ?? null,
    }));
  return JSON.stringify({ count: matches.length, customers: matches });
}

async function recentReviews(input: { pending_only?: unknown; limit?: unknown }): Promise<string> {
  const { reviews } = await getAdminReviews();
  const limit = Number.isInteger(Number(input.limit)) && Number(input.limit) > 0 ? Number(input.limit) : 8;
  const list = (input.pending_only ? reviews.filter((r) => r.status === "PENDING") : reviews)
    .slice(0, limit)
    .map((r) => ({
      author: r.authorName,
      rating: r.rating,
      comment: r.comment,
      product: r.productName ?? null,
      status: r.status,
      hasReply: Boolean(r.reply),
    }));
  return JSON.stringify({ count: list.length, reviews: list });
}

export async function executeStaffTool(name: string, input: unknown): Promise<string> {
  try {
    const data = (input ?? {}) as Record<string, unknown>;
    switch (name) {
      case "dashboard_summary":
        return await dashboardSummary();
      case "search_orders":
        return await searchOrders(data);
      case "find_customer":
        return await findCustomer(data);
      case "recent_reviews":
        return await recentReviews(data);
      default:
        return JSON.stringify({ error: `Outil inconnu : ${name}` });
    }
  } catch {
    return JSON.stringify({ error: "Échec de l'outil." });
  }
}
