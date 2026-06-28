import { pizzas } from "@/data/pizzas";

/**
 * Logique de commande partagée entre la commande « sur place » (/api/orders)
 * et le tunnel de paiement en ligne (/api/checkout).
 *
 * IMPORTANT (sécurité) : les prix ne viennent JAMAIS du client. On revalide
 * chaque article contre le catalogue serveur et on recalcule tous les totaux.
 */

export type OrderChannel = "DELIVERY" | "PICKUP" | "DINE_IN";
export const ORDER_CHANNELS: OrderChannel[] = ["DELIVERY", "PICKUP", "DINE_IN"];

export const DELIVERY_FEE = 2.5;
export const DELIVERY_MINIMUM = 15;
export const MAX_ITEM_QTY = 20;

/**
 * Catalogue serveur des options (taille + suppléments) avec leurs suppléments
 * de prix. Source de vérité : le client ne peut PAS imposer un prix d'option.
 */
export const PIZZA_SIZES = [
  { label: "Junior", priceDelta: -2 },
  { label: "Normale", priceDelta: 0 },
  { label: "Méga", priceDelta: 4 },
] as const;

export const PIZZA_SUPPLEMENTS = [
  { label: "Fromage en plus", priceDelta: 1.5 },
  { label: "Œuf", priceDelta: 1 },
  { label: "Olives", priceDelta: 1 },
  { label: "Champignons", priceDelta: 1 },
  { label: "Sauce piquante", priceDelta: 0.5 },
] as const;

const OPTION_DELTAS = new Map<string, number>([
  ...PIZZA_SIZES.map((o) => [o.label, o.priceDelta] as const),
  ...PIZZA_SUPPLEMENTS.map((o) => [o.label, o.priceDelta] as const),
]);

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

export interface ValidatedItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BuiltOrder {
  orderNumber: string;
  channel: OrderChannel;
  customer: OrderCustomer;
  items: ValidatedItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  etaMinutes: number;
}

export type BuildResult =
  | { ok: true; order: BuiltOrder }
  | { ok: false; error: string };

const round2 = (value: number) => Math.round(value * 100) / 100;

export function cleanField(value: unknown, max = 200): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Numéro de commande lisible et unique (WEB-AAAAMMJJ-XXXXXX). */
export function generateOrderNumber(date = new Date()): string {
  const day = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `WEB-${day}-${suffix}`;
}

/**
 * Valide un payload de commande (channel + client + items) et reconstruit
 * une commande fiable avec prix serveur. Ne dépend d'aucune donnée de prix client.
 */
export function buildOrder(body: unknown): BuildResult {
  const payload = (body ?? {}) as {
    channel?: unknown;
    customer?: Record<string, unknown>;
    items?: unknown;
  };

  const channel = payload.channel as OrderChannel;
  if (!ORDER_CHANNELS.includes(channel)) {
    return { ok: false, error: "Mode de commande invalide." };
  }

  const customer: OrderCustomer = {
    name: cleanField(payload.customer?.name),
    phone: cleanField(payload.customer?.phone),
    email: cleanField(payload.customer?.email),
    address: cleanField(payload.customer?.address, 300),
    note: cleanField(payload.customer?.note, 600),
  };

  if (!customer.name || !customer.phone) {
    return { ok: false, error: "Nom et téléphone obligatoires." };
  }
  if (customer.email && !isValidEmail(customer.email)) {
    return { ok: false, error: "Email invalide." };
  }
  if (channel === "DELIVERY" && !customer.address) {
    return { ok: false, error: "Adresse de livraison obligatoire." };
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return { ok: false, error: "Panier vide." };
  }

  const catalog = new Map(pizzas.map((pizza) => [pizza.id, pizza]));
  const items = payload.items
    .map((item): ValidatedItem | null => {
      if (!item || typeof item !== "object") return null;
      const raw = item as { id?: unknown; quantity?: unknown; options?: unknown };
      const pizza = typeof raw.id === "string" ? catalog.get(raw.id) : undefined;
      const quantity = Number(raw.quantity);
      if (!pizza || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QTY) {
        return null;
      }
      // Options : on ne garde que celles du catalogue serveur (prix recalculé).
      const labels = Array.isArray(raw.options)
        ? raw.options
            .map((o) => (o && typeof o === "object" ? (o as { label?: unknown }).label : null))
            .filter((l): l is string => typeof l === "string" && OPTION_DELTAS.has(l))
        : [];
      const optionsDelta = labels.reduce((s, l) => s + (OPTION_DELTAS.get(l) ?? 0), 0);
      const unitPrice = Math.max(0, round2(pizza.price + optionsDelta));
      const name = labels.length ? `${pizza.name} (${labels.join(", ")})` : pizza.name;
      return {
        id: pizza.id,
        name,
        quantity,
        unitPrice,
        total: round2(unitPrice * quantity),
      };
    })
    .filter((item): item is ValidatedItem => item !== null);

  if (items.length === 0) {
    return { ok: false, error: "Articles invalides." };
  }

  const subtotal = round2(items.reduce((sum, item) => sum + item.total, 0));
  if (channel === "DELIVERY" && subtotal < DELIVERY_MINIMUM) {
    return { ok: false, error: "Minimum livraison : 15,00 €." };
  }

  const deliveryFee = channel === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = round2(subtotal + deliveryFee);

  return {
    ok: true,
    order: {
      orderNumber: generateOrderNumber(),
      channel,
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      etaMinutes: channel === "DELIVERY" ? 30 : 20,
    },
  };
}
