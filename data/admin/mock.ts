/**
 * Données de démonstration du back-office, générées de façon DÉTERMINISTE
 * (PRNG à graine fixe + date de référence figée) afin que le rendu serveur et
 * client soient identiques — pas de décalage d'hydratation Next.js.
 *
 * En production, ces tableaux seront remplacés par des requêtes Prisma.
 * Les composants consomment uniquement ces structures : la bascule vers la
 * vraie base se fait sans toucher à l'UI.
 */
import type {
  AdminUser,
  Campaign,
  Customer,
  Driver,
  DeliveryZone,
  NotificationItem,
  Order,
  OrderChannel,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  PromoCode,
  Reservation,
  Review,
  StockItem,
  ActivityLog,
  MediaFile,
} from "@/lib/admin/types";
import { pizzas } from "@/data/pizzas";
import { menuItems } from "@/data/menu-items";

// Date de référence figée = "aujourd'hui" pour la démo (déterministe).
export const NOW = new Date("2026-06-28T20:30:00.000Z");

/** PRNG mulberry32 — déterministe à partir d'une graine. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20260628);

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const round2 = (n: number) => Math.round(n * 100) / 100;
/** Date à `days` jours et `minutes` minutes avant NOW. */
const daysAgo = (days: number, minutes = 0) =>
  new Date(NOW.getTime() - days * 86400000 - minutes * 60000).toISOString();

const firstNames = ["Camille", "Marco", "Sarah", "Julien", "Léa", "Thomas", "Emma", "Lucas", "Chloé", "Hugo", "Inès", "Nathan", "Manon", "Yanis", "Sofia", "Adam", "Jade", "Louis", "Nina", "Rayan"];
const lastNames = ["Dubois", "Rossi", "Bernard", "Martin", "Moreau", "Lefèvre", "Garcia", "Conti", "Petit", "Roux", "Faure", "Lopez", "Ferrari", "Blanc", "Henry"];
const streets = ["Rue de la Paix", "Avenue de l'Italie", "Boulevard Voltaire", "Rue Saint-Antoine", "Rue Mouffetard", "Avenue Gambetta", "Rue de Tolbiac", "Boulevard Auriol"];
const zips = ["75013", "75012", "75005", "75011", "94200", "75014"];

// ----------------------------------------------------------------------------
// Utilisateurs internes
// ----------------------------------------------------------------------------
export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Giovanni Bianchi", email: "giovanni@labella.fr", role: "SUPER_ADMIN", phone: "06 10 00 00 01", active: true, lastLoginAt: daysAgo(0, 35), createdAt: daysAgo(420) },
  { id: "u2", name: "Sofia Marchetti", email: "sofia@labella.fr", role: "MANAGER", phone: "06 10 00 00 02", active: true, lastLoginAt: daysAgo(0, 120), createdAt: daysAgo(300) },
  { id: "u3", name: "Karim Benali", email: "karim@labella.fr", role: "KITCHEN", phone: "06 10 00 00 03", active: true, lastLoginAt: daysAgo(1, 60), createdAt: daysAgo(210) },
  { id: "u4", name: "Lucas Petit", email: "lucas@labella.fr", role: "DRIVER", phone: "06 10 00 00 04", active: true, lastLoginAt: daysAgo(0, 15), createdAt: daysAgo(150) },
  { id: "u5", name: "Emma Laurent", email: "emma@labella.fr", role: "SUPPORT", phone: "06 10 00 00 05", active: true, lastLoginAt: daysAgo(2), createdAt: daysAgo(90) },
  { id: "u6", name: "Paolo Greco", email: "paolo@labella.fr", role: "DRIVER", phone: "06 10 00 00 06", active: false, lastLoginAt: daysAgo(40), createdAt: daysAgo(120) },
];

// ----------------------------------------------------------------------------
// Produits (catalogue admin = pizzas du site + boissons/desserts)
// ----------------------------------------------------------------------------
const typeFromCategory = (cat: string): Product["type"] =>
  cat === "boissons" ? "DRINK" : cat === "desserts" ? "DESSERT" : "SIDE";

export const products: Product[] = [
  ...pizzas.map((p, i) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: "PIZZA" as const,
    category: p.tags.includes("Premium") ? "Pizzas premium" : p.tags.includes("Végétarienne") ? "Pizzas végétariennes" : p.tags.includes("Épicée") ? "Pizzas épicées" : "Pizzas classiques",
    price: p.price,
    image: p.image,
    badges: p.tags,
    available: i % 11 !== 0, // une indisponible pour la démo
    visible: true,
    featured: !!p.featured,
    prepMinutes: randInt(10, 16),
    soldCount: randInt(40, 320),
  })),
  ...menuItems.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.id,
    type: typeFromCategory(m.category),
    category: m.category === "boissons" ? "Boissons" : m.category === "desserts" ? "Desserts" : "Accompagnements",
    price: m.price,
    badges: m.tags ?? [],
    available: true,
    visible: true,
    featured: false,
    prepMinutes: 2,
    soldCount: randInt(20, 200),
  })),
];

const pizzaProducts = products.filter((p) => p.type === "PIZZA");

// ----------------------------------------------------------------------------
// Clients
// ----------------------------------------------------------------------------
const tagPool = ["VIP", "Client fidèle", "Nouveau client", "Gros panier", "Inactif", "Livraison fréquente", "Retrait fréquent", "Entreprise"];

export const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const ordersCount = randInt(1, 38);
  const avgBasket = round2(randInt(1800, 4200) / 100);
  const totalSpent = round2(ordersCount * avgBasket);
  const tags: string[] = [];
  if (totalSpent > 600) tags.push("VIP");
  if (ordersCount > 20) tags.push("Client fidèle");
  if (ordersCount <= 2) tags.push("Nouveau client");
  if (avgBasket > 35) tags.push("Gros panier");
  if (tags.length === 0) tags.push(pick(tagPool));
  const lastDays = randInt(0, 80);
  return {
    id: `c${i + 1}`,
    firstName,
    lastName,
    email: `${firstName}.${lastName}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + `@email.fr`,
    phone: `06 ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    tags,
    ordersCount,
    totalSpent,
    avgBasket,
    lastOrderAt: lastDays > 60 ? daysAgo(lastDays) : daysAgo(lastDays),
    createdAt: daysAgo(randInt(90, 600)),
    allergies: rand() > 0.85 ? pick(["Gluten", "Lactose", "Fruits à coque"]) : undefined,
    marketingOptIn: rand() > 0.4,
    smsOptIn: rand() > 0.6,
    loyaltyPoints: ordersCount * randInt(8, 20),
  };
});

// ----------------------------------------------------------------------------
// Commandes (100, réparties sur ~30 jours)
// ----------------------------------------------------------------------------
const channels: OrderChannel[] = ["DELIVERY", "DELIVERY", "DELIVERY", "PICKUP", "PICKUP", "DINE_IN", "QR_TABLE"];
const liveStatuses: OrderStatus[] = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];
const payMethods: PaymentMethod[] = ["CARD_ONLINE", "CARD_ONLINE", "CARD_ON_SITE", "CASH"];

function buildItems() {
  const count = randInt(1, 4);
  const items = Array.from({ length: count }, () => {
    const p = pick(pizzaProducts);
    const quantity = randInt(1, 2);
    const options = rand() > 0.6 ? [pick(["Pâte fine", "Pâte épaisse", "Fromage en plus (+1,50€)", "Sauce piquante"])] : undefined;
    return { name: p.name, quantity, unitPrice: p.price, options };
  });
  // Ajoute parfois une boisson
  if (rand() > 0.5) {
    const d = pick(products.filter((p) => p.type === "DRINK"));
    items.push({ name: d.name, quantity: 1, unitPrice: d.price, options: undefined });
  }
  return items;
}

export const orders: Order[] = Array.from({ length: 100 }, (_, i) => {
  const idx = 100 - i; // numéros décroissants pour les plus récents
  const dayOffset = Math.floor(i / 3.4); // ~3 commandes/jour
  const minutes = randInt(0, 720);
  const channel = pick(channels);
  // Les commandes récentes (aujourd'hui) sont "en cours", les autres terminées.
  const isToday = dayOffset === 0;
  let status: OrderStatus;
  if (isToday) status = pick(liveStatuses);
  else status = pick<OrderStatus>(["DELIVERED", "DELIVERED", "PICKED_UP", "DELIVERED", "CANCELLED"]);
  if (channel !== "DELIVERY" && status === "OUT_FOR_DELIVERY") status = "PREPARING";

  const customer = pick(customers);
  const items = buildItems();
  const subtotal = round2(items.reduce((s, it) => s + it.unitPrice * it.quantity, 0));
  const deliveryFee = channel === "DELIVERY" ? 2.5 : 0;
  const discount = rand() > 0.8 ? round2(subtotal * 0.1) : 0;
  const total = round2(subtotal + deliveryFee - discount);

  let paymentStatus: PaymentStatus = "PAID";
  if (status === "CANCELLED") paymentStatus = rand() > 0.5 ? "REFUNDED" : "FAILED";
  else if (isToday && status === "NEW") paymentStatus = rand() > 0.5 ? "PENDING" : "PAID";

  return {
    id: `o${idx}`,
    number: `CMD-2026-${String(idx).padStart(4, "0")}`,
    channel,
    status,
    customerName: `${customer.firstName} ${customer.lastName}`,
    customerPhone: customer.phone,
    address: channel === "DELIVERY" ? `${randInt(1, 80)} ${pick(streets)}, ${pick(zips)} Paris` : undefined,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    paymentStatus,
    paymentMethod: pick(payMethods),
    customerNote: rand() > 0.85 ? "Sonnez deux fois, merci !" : undefined,
    allergyNote: customer.allergies ? `Allergie : ${customer.allergies}` : undefined,
    createdAt: daysAgo(dayOffset, minutes),
    prepMinutes: randInt(12, 28),
  };
});

/** Commandes du jour (pour le dashboard et la vue cuisine). */
export const todayOrders = orders.filter(
  (o) => new Date(o.createdAt).toDateString() === NOW.toDateString(),
);

// ----------------------------------------------------------------------------
// Réservations
// ----------------------------------------------------------------------------
export const reservations: Reservation[] = Array.from({ length: 12 }, (_, i) => {
  const customer = pick(customers);
  const future = i < 8;
  const offset = future ? -randInt(0, 6) : randInt(1, 20); // négatif = à venir
  return {
    id: `r${i + 1}`,
    name: `${customer.firstName} ${customer.lastName}`,
    phone: customer.phone,
    email: customer.email,
    date: daysAgo(offset, randInt(-300, 300)),
    partySize: randInt(2, 8),
    status: future ? pick(["PENDING", "CONFIRMED", "CONFIRMED"]) : pick(["ARRIVED", "NO_SHOW", "CANCELLED"]),
    note: rand() > 0.7 ? "Table près de la fenêtre si possible" : undefined,
  };
});

// ----------------------------------------------------------------------------
// Promotions
// ----------------------------------------------------------------------------
export const promoCodes: PromoCode[] = [
  { id: "p1", code: "BIENVENUE10", description: "-10% sur la première commande", type: "PERCENTAGE", value: 10, minOrder: 15, usedCount: 142, maxUses: null, endsAt: daysAgo(-180), active: true },
  { id: "p2", code: "LIVRAISON0", description: "Livraison offerte dès 25€", type: "FREE_DELIVERY", value: 0, minOrder: 25, usedCount: 88, maxUses: 500, endsAt: daysAgo(-30), active: true },
  { id: "p3", code: "DUO5", description: "-5€ sur le menu Duo", type: "FIXED_AMOUNT", value: 5, minOrder: 27, usedCount: 53, maxUses: 300, endsAt: daysAgo(-12), active: true },
  { id: "p4", code: "ETE2025", description: "Offre d'été expirée", type: "PERCENTAGE", value: 15, minOrder: 20, usedCount: 410, maxUses: 410, endsAt: daysAgo(280), active: false },
  { id: "p5", code: "VIP20", description: "-20% clients VIP", type: "PERCENTAGE", value: 20, minOrder: 0, usedCount: 27, maxUses: 100, endsAt: daysAgo(-60), active: true },
];

// ----------------------------------------------------------------------------
// Avis
// ----------------------------------------------------------------------------
const reviewComments = [
  "Excellente pizza, pâte parfaite et livraison rapide !",
  "Très bon mais un peu d'attente le vendredi soir.",
  "La meilleure Margherita du quartier, sans hésiter.",
  "Commande complète et chaude, service au top.",
  "Un peu trop cuite à mon goût cette fois-ci.",
  "Ingrédients frais et généreux, je recommande !",
  "Parfait pour un repas en famille, les enfants adorent.",
];
export const reviews: Review[] = Array.from({ length: 14 }, (_, i) => {
  const customer = pick(customers);
  const rating = pick([5, 5, 5, 4, 4, 3, 2]);
  return {
    id: `rev${i + 1}`,
    authorName: `${customer.firstName} ${customer.lastName.charAt(0)}.`,
    rating,
    comment: pick(reviewComments),
    productName: rand() > 0.4 ? pick(pizzaProducts).name : undefined,
    status: i < 3 ? "PENDING" : pick(["PUBLISHED", "PUBLISHED", "PUBLISHED", "HIDDEN"]),
    reply: rand() > 0.7 ? "Merci pour votre retour, à très bientôt chez La Bella !" : undefined,
    createdAt: daysAgo(randInt(0, 45)),
  };
});

// ----------------------------------------------------------------------------
// Livraison
// ----------------------------------------------------------------------------
export const drivers: Driver[] = [
  { id: "d1", name: "Lucas Petit", phone: "06 10 00 00 04", available: true, activeDeliveries: 2, totalDeliveries: 1284 },
  { id: "d2", name: "Paolo Greco", phone: "06 10 00 00 06", available: false, activeDeliveries: 0, totalDeliveries: 956 },
  { id: "d3", name: "Yanis Mabrouk", phone: "06 10 00 00 07", available: true, activeDeliveries: 1, totalDeliveries: 642 },
  { id: "d4", name: "Nina Costa", phone: "06 10 00 00 08", available: true, activeDeliveries: 0, totalDeliveries: 318 },
];

export const deliveryZones: DeliveryZone[] = [
  { id: "z1", name: "Paris 13e", postalCodes: ["75013"], fee: 2.5, minOrder: 15, etaMinutes: 25, active: true },
  { id: "z2", name: "Paris 12e", postalCodes: ["75012"], fee: 2.5, minOrder: 15, etaMinutes: 30, active: true },
  { id: "z3", name: "Paris 5e", postalCodes: ["75005"], fee: 3.5, minOrder: 20, etaMinutes: 35, active: true },
  { id: "z4", name: "Ivry-sur-Seine", postalCodes: ["94200"], fee: 4.0, minOrder: 25, etaMinutes: 40, active: true },
  { id: "z5", name: "Paris 14e", postalCodes: ["75014"], fee: 3.5, minOrder: 20, etaMinutes: 35, active: false },
];

// ----------------------------------------------------------------------------
// Stocks
// ----------------------------------------------------------------------------
const stockDefs: Array<[string, string, number, number]> = [
  ["Mozzarella fior di latte", "kg", 18, 8],
  ["Pâte (boules)", "u", 120, 50],
  ["Sauce tomate San Marzano", "L", 24, 10],
  ["Jambon", "kg", 6, 5],
  ["Champignons frais", "kg", 9, 4],
  ["Olives noires", "kg", 3, 4],
  ["Pepperoni", "kg", 2, 5],
  ["Farine type 00", "kg", 85, 30],
  ["Basilic frais", "botte", 14, 6],
  ["Gorgonzola", "kg", 4, 3],
];
export const stockItems: StockItem[] = stockDefs.map(([name, unit, quantity, threshold], i) => ({
  id: `s${i + 1}`,
  name,
  unit,
  quantity,
  threshold,
  status: quantity <= 0 ? "OUT" : quantity <= threshold ? "LOW" : "OK",
}));

// ----------------------------------------------------------------------------
// Campagnes marketing
// ----------------------------------------------------------------------------
export const campaigns: Campaign[] = [
  { id: "cmp1", name: "Nouvelle pizza Frutti di Mare", channel: "EMAIL", status: "SENT", segment: "Tous les clients", recipients: 1840, openRate: 38.4, clickRate: 9.2, sentAt: daysAgo(8) },
  { id: "cmp2", name: "Relance clients inactifs 30j", channel: "EMAIL", status: "SENT", segment: "Inactifs 30j", recipients: 320, openRate: 24.1, clickRate: 6.8, sentAt: daysAgo(15) },
  { id: "cmp3", name: "Offre week-end -15%", channel: "SMS", status: "SCHEDULED", segment: "Clients fidèles", recipients: 540, openRate: null, clickRate: null, sentAt: null },
  { id: "cmp4", name: "Menu étudiant rentrée", channel: "EMAIL", status: "DRAFT", segment: "Nouveaux clients", recipients: 0, openRate: null, clickRate: null, sentAt: null },
];

// ----------------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------------
export const notifications: NotificationItem[] = [
  { id: "n1", type: "NEW_ORDER", title: "Nouvelle commande", body: "CMD-2026-0100 · 2 articles · Livraison", read: false, createdAt: daysAgo(0, 4) },
  { id: "n2", type: "NEW_RESERVATION", title: "Nouvelle réservation", body: "4 couverts ce soir à 20h30", read: false, createdAt: daysAgo(0, 22) },
  { id: "n3", type: "LOW_STOCK", title: "Stock bas", body: "Olives noires sous le seuil d'alerte", read: false, createdAt: daysAgo(0, 95) },
  { id: "n4", type: "NEW_REVIEW", title: "Nouvel avis client", body: "★★★★★ « Excellente pizza ! »", read: true, createdAt: daysAgo(1, 30) },
  { id: "n5", type: "PAYMENT_RECEIVED", title: "Paiement reçu", body: "28,40 € · CMD-2026-0098", read: true, createdAt: daysAgo(1, 120) },
  { id: "n6", type: "DELIVERY_LATE", title: "Livraison en retard", body: "CMD-2026-0096 dépasse l'ETA de 10 min", read: true, createdAt: daysAgo(2) },
];

// ----------------------------------------------------------------------------
// Journal d'activité
// ----------------------------------------------------------------------------
const logActions: Array<[string, string, string]> = [
  ["order.status.update", "Commande", "CMD-2026-0099 → En préparation"],
  ["product.price.update", "Produit", "Diavola : 12,90 € → 13,50 €"],
  ["promo.create", "Promotion", "Création du code VIP20"],
  ["order.refund", "Paiement", "Remboursement CMD-2026-0094 (12,90 €)"],
  ["product.update", "Produit", "Margherita marquée indisponible"],
  ["user.login", "Authentification", "Connexion réussie"],
  ["customer.anonymize", "Client", "Anonymisation RGPD d'un client"],
  ["settings.update", "Paramètres", "Frais de livraison par défaut modifiés"],
];
export const activityLogs: ActivityLog[] = Array.from({ length: 18 }, (_, i) => {
  const [action, entity, detail] = logActions[i % logActions.length];
  const user = pick(adminUsers);
  return {
    id: `log${i + 1}`,
    userName: user.name,
    action,
    entity,
    detail,
    createdAt: daysAgo(Math.floor(i / 3), randInt(0, 600)),
  };
});

// ----------------------------------------------------------------------------
// Médiathèque
// ----------------------------------------------------------------------------
export const mediaFiles: MediaFile[] = [
  ...pizzas.slice(0, 8).map((p) => ({ id: `m-${p.slug}`, url: p.image, name: `${p.slug}.svg`, folder: "pizzas" })),
  { id: "m-hero", url: "/images/pizzeria/01_hero_pizza_premium.png", name: "hero.svg", folder: "restaurant" },
  { id: "m-oven", url: "/images/pizzeria/09_four_a_bois_pizza.png", name: "oven.svg", folder: "restaurant" },
  { id: "m-chef", url: "/images/pizzeria/10_pizzaiolo_preparation_pate.png", name: "chef.svg", folder: "equipe" },
  { id: "m-delivery", url: "/images/pizzeria/08_livraison_scooter_ambiance_italienne.png", name: "delivery.svg", folder: "promo" },
];
