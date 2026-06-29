import type Anthropic from "@anthropic-ai/sdk";
import { pizzas } from "@/data/pizzas";
import { formulas } from "@/data/menus";
import { menuItems } from "@/data/menu-items";
import { openingHours, hoursSummary, site } from "@/data/site";
import {
  PIZZA_SIZES,
  PIZZA_SUPPLEMENTS,
  DELIVERY_FEE,
  DELIVERY_MINIMUM,
  ORDER_CHANNELS,
  priceCart,
  buildOrder,
  type OrderChannel,
} from "@/lib/orders";
import { createCheckoutSession } from "@/lib/checkout";
import { createOrder, getOrderTracking } from "@/lib/orders-repo";
import { createReservation } from "@/lib/reservations-repo";
import { getActivePromotions } from "@/lib/promos-repo";
import { getLoyaltyByPhone } from "@/lib/loyalty-repo";
import { sendHandoffEmail } from "@/lib/email";

const SIZE_LABELS = PIZZA_SIZES.map((s) => s.label);
const SUPPLEMENT_LABELS = PIZZA_SUPPLEMENTS.map((s) => s.label);

/**
 * Outils (lecture seule) de l'assistant Bella — Phase 0.
 *
 * Chaque outil renvoie des données AUTORITATIVES issues du catalogue serveur :
 * l'agent ne calcule ni n'invente jamais un prix. Les phases suivantes
 * ajouteront des outils transactionnels (panier, paiement, suivi, réservation).
 */

/** Replie les accents/casse pour une recherche tolérante. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// ---------------------------------------------------------------------------
// Définitions (schéma exposé au modèle)
// ---------------------------------------------------------------------------

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_menu",
    description:
      "Recherche dans la carte (pizzas, menus, accompagnements, desserts, boissons) avec des filtres optionnels. Utilise-le pour recommander des produits, filtrer par prix/régime, ou lister une catégorie.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "Mots-clés (nom ou ingrédient). Optionnel." },
        category: {
          type: "string",
          enum: ["pizzas", "menus", "accompagnements", "desserts", "boissons"],
          description: "Restreindre à une catégorie. Optionnel.",
        },
        vegetarian: { type: "boolean", description: "Seulement les produits végétariens." },
        spicy: { type: "boolean", description: "Seulement les pizzas épicées." },
        max_price: { type: "number", description: "Prix maximum en euros." },
      },
    },
  },
  {
    name: "get_pizza",
    description:
      "Détails complets d'une pizza : ingrédients, allergènes implicites, tags, prix de base, tailles disponibles et suppléments avec leurs prix.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", description: "Nom ou slug de la pizza (ex. « Diavola »)." },
      },
      required: ["name"],
    },
  },
  {
    name: "opening_hours",
    description: "Horaires d'ouverture de la pizzeria (jour par jour) et résumé.",
    input_schema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "delivery_info",
    description:
      "Informations de livraison : frais, minimum de commande, zone, adresse et téléphone.",
    input_schema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "build_cart",
    description:
      "Chiffre un panier (prix infalsifiables, recalculés serveur) pour le récapituler au client AVANT toute commande. N'enregistre rien, ne paie rien.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          description: "Articles du panier.",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              pizza: { type: "string", description: "Nom de la pizza (ex. « Diavola »)." },
              size: { type: "string", enum: SIZE_LABELS, description: "Taille (défaut Normale)." },
              supplements: {
                type: "array",
                items: { type: "string", enum: SUPPLEMENT_LABELS },
                description: "Suppléments éventuels.",
              },
              quantity: { type: "integer", description: "Quantité (défaut 1)." },
            },
            required: ["pizza"],
          },
        },
        channel: {
          type: "string",
          enum: ORDER_CHANNELS,
          description: "Mode : DELIVERY (livraison), PICKUP (à emporter), DINE_IN (sur place). Défaut PICKUP.",
        },
      },
      required: ["items"],
    },
  },
  {
    name: "create_checkout",
    description:
      "Crée la commande et renvoie un LIEN DE PAIEMENT sécurisé. À n'appeler qu'APRÈS avoir récapitulé le panier, obtenu la confirmation explicite du client, et collecté ses coordonnées (nom + téléphone ; adresse obligatoire si livraison).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              pizza: { type: "string" },
              size: { type: "string", enum: SIZE_LABELS },
              supplements: { type: "array", items: { type: "string", enum: SUPPLEMENT_LABELS } },
              quantity: { type: "integer" },
            },
            required: ["pizza"],
          },
        },
        channel: { type: "string", enum: ORDER_CHANNELS },
        customer: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            address: { type: "string", description: "Adresse complète (obligatoire si livraison)." },
            note: { type: "string", description: "Remarque éventuelle (allergie, étage…)." },
          },
          required: ["name", "phone"],
        },
      },
      required: ["items", "channel", "customer"],
    },
  },
  {
    name: "track_order",
    description:
      "Donne le statut d'une commande. Nécessite le numéro ET le téléphone du client (confidentialité).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        order_number: { type: "string", description: "Numéro de commande (ex. WEB-20260628-A1B2C3)." },
        phone: { type: "string", description: "Téléphone utilisé lors de la commande." },
      },
      required: ["order_number", "phone"],
    },
  },
  {
    name: "make_reservation",
    description:
      "Réserve une table. Récapitule les détails et confirme avec le client AVANT d'appeler l'outil. Service de 11h à 23h.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string", description: "Date au format AAAA-MM-JJ." },
        time: { type: "string", description: "Heure au format HH:MM (24h)." },
        party_size: { type: "integer", description: "Nombre de personnes (1 à 20)." },
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        note: { type: "string", description: "Demande particulière (terrasse, anniversaire…)." },
      },
      required: ["date", "time", "party_size", "name", "phone"],
    },
  },
  {
    name: "get_promotions",
    description: "Liste les promotions et codes promo actifs du moment.",
    input_schema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "handoff_to_human",
    description:
      "Transmet la demande à l'équipe humaine (réclamation, demande complexe, suivi délicat). Recueille nom + téléphone et résume clairement le motif.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reason: { type: "string", description: "Résumé clair de la demande du client." },
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
      },
      required: ["reason", "name", "phone"],
    },
  },
  {
    name: "loyalty_balance",
    description:
      "Donne le solde de points de fidélité et le palier d'un client à partir de son téléphone.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { phone: { type: "string", description: "Téléphone du compte client." } },
      required: ["phone"],
    },
  },
];

// ---------------------------------------------------------------------------
// Exécuteurs (logique serveur)
// ---------------------------------------------------------------------------

interface SearchInput {
  query?: string;
  category?: string;
  vegetarian?: boolean;
  spicy?: boolean;
  max_price?: number;
}

interface Hit {
  name: string;
  price: number;
  category: string;
  tags: string[];
  description: string;
}

function searchMenu(input: SearchInput): Hit[] {
  const { query, category, vegetarian, spicy, max_price } = input;
  const q = query ? fold(query) : null;
  const hits: Hit[] = [];

  const wantCat = (c: string) => !category || category === c;

  if (wantCat("pizzas")) {
    for (const p of pizzas) {
      hits.push({
        name: p.name,
        price: p.price,
        category: "pizzas",
        tags: p.tags,
        description: p.description,
      });
    }
  }
  if (wantCat("menus")) {
    for (const f of formulas) {
      hits.push({
        name: f.name,
        price: f.price,
        category: "menus",
        tags: f.badge ? [f.badge] : [],
        description: `${f.description} (${f.items.join(", ")})`,
      });
    }
  }
  for (const cat of ["accompagnements", "desserts", "boissons"] as const) {
    if (!wantCat(cat)) continue;
    for (const m of menuItems.filter((i) => i.category === cat)) {
      hits.push({
        name: m.name,
        price: m.price,
        category: cat,
        tags: m.tags ?? [],
        description: m.description ?? "",
      });
    }
  }

  return hits.filter((h) => {
    if (max_price != null && h.price > max_price) return false;
    if (vegetarian && !h.tags.some((t) => /v[ée]g[ée]tarie/i.test(t))) return false;
    if (spicy && !h.tags.some((t) => /[ée]pic/i.test(t))) return false;
    if (q) {
      const hay = fold(`${h.name} ${h.description} ${h.tags.join(" ")}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function getPizza(name: string): unknown {
  const needle = fold(name);
  const p =
    pizzas.find((x) => fold(x.slug) === needle || fold(x.name) === needle) ??
    pizzas.find((x) => fold(x.name).includes(needle) || fold(x.slug).includes(needle));

  if (!p) {
    return {
      found: false,
      message: "Pizza introuvable.",
      available: pizzas.map((x) => x.name),
    };
  }

  return {
    found: true,
    name: p.name,
    basePrice: p.price,
    description: p.description,
    ingredients: p.ingredients,
    tags: p.tags,
    sizes: PIZZA_SIZES.map((s) => ({ label: s.label, priceDelta: s.priceDelta })),
    supplements: PIZZA_SUPPLEMENTS.map((s) => ({ label: s.label, priceDelta: s.priceDelta })),
  };
}

function deliveryInfo() {
  return {
    deliveryFee: DELIVERY_FEE,
    minimumOrder: DELIVERY_MINIMUM,
    estimatedTime: "environ 30 minutes",
    zone: `${site.address.city} et alentours`,
    phone: site.phone,
    address: site.address.full,
    modes: ["Livraison", "À emporter", "Sur place"],
  };
}

// ---- Outils transactionnels (Phase 1) ----

const STATUS_LABELS: Record<string, string> = {
  NEW: "reçue",
  CONFIRMED: "confirmée",
  PREPARING: "en préparation",
  READY: "prête",
  OUT_FOR_DELIVERY: "en livraison",
  DELIVERED: "livrée",
  PICKED_UP: "récupérée",
  CANCELLED: "annulée",
  REFUNDED: "remboursée",
};

function normalizeChannel(value: unknown): OrderChannel {
  const v = typeof value === "string" ? value.toUpperCase() : "";
  return (ORDER_CHANNELS as readonly string[]).includes(v) ? (v as OrderChannel) : "PICKUP";
}

interface RawItem {
  pizza?: unknown;
  size?: unknown;
  supplements?: unknown;
  quantity?: unknown;
}

/** Convertit les articles « conviviaux » de Bella en items validables par priceCart/buildOrder. */
function resolveOrderItems(
  raw: unknown,
): { id: string; quantity: number; options: { label: string }[] }[] {
  if (!Array.isArray(raw)) return [];
  const result: { id: string; quantity: number; options: { label: string }[] }[] = [];
  for (const entry of raw) {
    const it = entry as RawItem;
    const needle = typeof it.pizza === "string" ? fold(it.pizza) : "";
    if (!needle) continue;
    const p =
      pizzas.find((x) => fold(x.slug) === needle || fold(x.name) === needle) ??
      pizzas.find((x) => fold(x.name).includes(needle) || fold(x.slug).includes(needle));
    if (!p) continue;

    const options: { label: string }[] = [];
    if (typeof it.size === "string" && it.size && fold(it.size) !== "normale") {
      options.push({ label: it.size });
    }
    if (Array.isArray(it.supplements)) {
      for (const s of it.supplements) if (typeof s === "string") options.push({ label: s });
    }
    const qn = Number(it.quantity);
    result.push({ id: p.id, quantity: Number.isInteger(qn) && qn > 0 ? qn : 1, options });
  }
  return result;
}

function buildCart(input: { items?: unknown; channel?: unknown }): string {
  const channel = normalizeChannel(input.channel);
  const items = resolveOrderItems(input.items);
  if (items.length === 0) {
    return JSON.stringify({ ok: false, error: "Aucun article reconnu. Vérifie les noms de pizzas." });
  }
  const priced = priceCart(items, channel);
  if (!priced.ok) return JSON.stringify({ ok: false, error: priced.error });
  return JSON.stringify({ ok: true, channel, currency: "EUR", ...priced.cart });
}

async function createCheckout(input: {
  items?: unknown;
  channel?: unknown;
  customer?: Record<string, unknown>;
}): Promise<string> {
  const channel = normalizeChannel(input.channel);
  const items = resolveOrderItems(input.items);
  const result = buildOrder({ channel, customer: input.customer ?? {}, items });
  if (!result.ok) return JSON.stringify({ ok: false, error: result.error });

  const order = result.order;
  await createOrder(order, true); // persiste la commande en attente (no-op en démo)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  try {
    const { url, demo } = await createCheckoutSession(order, baseUrl);
    return JSON.stringify({
      ok: true,
      orderNumber: order.orderNumber,
      total: order.total,
      channel: order.channel,
      etaMinutes: order.etaMinutes,
      paymentUrl: url,
      demo,
    });
  } catch {
    return JSON.stringify({ ok: false, error: "Paiement momentanément indisponible." });
  }
}

async function trackOrder(input: { order_number?: unknown; phone?: unknown }): Promise<string> {
  const number = String(input.order_number ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  if (!number || !phone) {
    return JSON.stringify({ ok: false, error: "Numéro de commande et téléphone requis." });
  }
  const t = await getOrderTracking(number, phone);
  if (t.demo) {
    return JSON.stringify({
      ok: false,
      message: `Le suivi en ligne n'est pas disponible en mode démonstration. Appelez le ${site.phone}.`,
    });
  }
  if (!t.found) {
    return JSON.stringify({ ok: false, message: "Aucune commande trouvée pour ce numéro et ce téléphone." });
  }
  return JSON.stringify({
    ok: true,
    number: t.number,
    status: STATUS_LABELS[t.status ?? ""] ?? t.status,
    channel: t.channel,
    total: t.total,
    createdAt: t.createdAt,
  });
}

// ---- Outils relation client (Phase 2) ----

async function makeReservation(input: {
  date?: unknown;
  time?: unknown;
  party_size?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  note?: unknown;
}): Promise<string> {
  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const dateStr = String(input.date ?? "").trim();
  const timeStr = String(input.time ?? "").trim();
  const partySize = Number(input.party_size);

  if (!name || !phone) return JSON.stringify({ ok: false, error: "Nom et téléphone requis." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{2}:\d{2}$/.test(timeStr)) {
    return JSON.stringify({ ok: false, error: "Date (AAAA-MM-JJ) et heure (HH:MM) requises." });
  }
  const date = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(date.getTime())) return JSON.stringify({ ok: false, error: "Date ou heure invalide." });
  if (date.getTime() < Date.now()) return JSON.stringify({ ok: false, error: "La date doit être dans le futur." });
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 20) {
    return JSON.stringify({ ok: false, error: "Nombre de personnes invalide (1 à 20)." });
  }
  const minutes = Number(timeStr.slice(0, 2)) * 60 + Number(timeStr.slice(3, 5));
  if (minutes < 11 * 60 || minutes > 22 * 60 + 30) {
    return JSON.stringify({ ok: false, error: "Service de 11h00 à 23h00 (dernière table vers 22h30)." });
  }

  const res = await createReservation({
    name,
    phone,
    email: String(input.email ?? "").trim() || undefined,
    date,
    partySize,
    note: String(input.note ?? "").trim() || undefined,
  });
  if (!res.ok) return JSON.stringify({ ok: false, error: res.error ?? "Échec de la réservation." });
  if (!res.persisted) {
    return JSON.stringify({
      ok: false,
      demo: true,
      message: `Je ne peux pas finaliser la réservation en ligne pour le moment. Appelez le ${site.phone} pour réserver votre table.`,
    });
  }
  return JSON.stringify({
    ok: true,
    status: "en attente de confirmation",
    date: dateStr,
    time: timeStr,
    partySize,
    message: "Réservation enregistrée — l'équipe vous confirmera par téléphone.",
  });
}

async function getPromotions(): Promise<string> {
  const promos = await getActivePromotions();
  if (promos.length === 0) {
    return JSON.stringify({
      ok: true,
      promos: [],
      message: "Aucun code promo en ligne actuellement. Découvrez nos menus à prix doux : /menus.",
    });
  }
  return JSON.stringify({ ok: true, promos });
}

async function handoffToHuman(input: {
  reason?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
}): Promise<string> {
  const reason = String(input.reason ?? "").trim();
  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  if (!reason || !name || !phone) {
    return JSON.stringify({ ok: false, error: "Motif, nom et téléphone requis." });
  }
  const sent = await sendHandoffEmail({
    reason,
    name,
    phone,
    email: String(input.email ?? "").trim() || undefined,
  });
  if (sent) {
    return JSON.stringify({
      ok: true,
      message: "Demande transmise à l'équipe — on vous recontacte au plus vite.",
    });
  }
  return JSON.stringify({
    ok: false,
    message: `Je n'ai pas pu transmettre automatiquement. Appelez le ${site.phone} ou écrivez via /contact, on s'occupe de vous.`,
  });
}

async function loyaltyBalance(input: { phone?: unknown }): Promise<string> {
  const phone = String(input.phone ?? "").trim();
  if (!phone) return JSON.stringify({ ok: false, error: "Téléphone requis." });
  const l = await getLoyaltyByPhone(phone);
  if (l.demo) {
    return JSON.stringify({
      ok: false,
      message: `Le solde de fidélité n'est pas disponible en démonstration. Demandez en boutique ou au ${site.phone}.`,
    });
  }
  if (!l.found) {
    return JSON.stringify({ ok: false, message: "Aucun compte fidélité trouvé pour ce numéro." });
  }
  return JSON.stringify({ ok: true, name: l.name, points: l.points, tier: l.tier });
}

/** Dispatch un appel d'outil et renvoie le résultat sérialisé (JSON). */
export async function executeTool(name: string, input: unknown): Promise<string> {
  try {
    const data = (input ?? {}) as Record<string, unknown>;
    switch (name) {
      case "search_menu":
        return JSON.stringify(searchMenu(data as SearchInput).slice(0, 12));
      case "get_pizza":
        return JSON.stringify(getPizza(String((data as { name?: string }).name ?? "")));
      case "opening_hours":
        return JSON.stringify({ summary: hoursSummary, days: openingHours });
      case "delivery_info":
        return JSON.stringify(deliveryInfo());
      case "build_cart":
        return buildCart(data);
      case "create_checkout":
        return await createCheckout(data);
      case "track_order":
        return await trackOrder(data);
      case "make_reservation":
        return await makeReservation(data);
      case "get_promotions":
        return await getPromotions();
      case "handoff_to_human":
        return await handoffToHuman(data);
      case "loyalty_balance":
        return await loyaltyBalance(data);
      default:
        return JSON.stringify({ error: `Outil inconnu : ${name}` });
    }
  } catch {
    return JSON.stringify({ error: "Échec de l'outil." });
  }
}
