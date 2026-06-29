/**
 * Seed de démonstration — La Bella Pizzeria.
 *
 * Exécution : `npm run db:seed` (nécessite une base PostgreSQL + DATABASE_URL,
 * puis `npx prisma migrate dev`).
 *
 * NB : les mots de passe doivent être hachés avec bcrypt en production.
 * Ici, `passwordHash` contient un placeholder ; l'auth de démo de l'app
 * utilise lib/admin/auth.ts (comptes démo), indépendant de ce champ.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mot de passe initial des comptes (À CHANGER après le premier login).
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "LaBella!2026";
const passwordHash = bcrypt.hashSync(SEED_PASSWORD, 10);

const users: Prisma.UserCreateInput[] = [
  { name: "Giovanni Bianchi", email: "superadmin@labella.fr", role: "SUPER_ADMIN", passwordHash },
  { name: "Sofia Marchetti", email: "manager@labella.fr", role: "MANAGER", passwordHash },
  { name: "Karim Benali", email: "cuisine@labella.fr", role: "KITCHEN", passwordHash },
  { name: "Lucas Petit", email: "livreur@labella.fr", role: "DRIVER", passwordHash },
  { name: "Emma Laurent", email: "support@labella.fr", role: "SUPPORT", passwordHash },
];

const categories: Prisma.CategoryCreateInput[] = [
  { name: "Pizzas classiques", slug: "pizzas-classiques", type: "PIZZA", position: 1 },
  { name: "Pizzas premium", slug: "pizzas-premium", type: "PIZZA", position: 2 },
  { name: "Boissons", slug: "boissons", type: "DRINK", position: 3 },
  { name: "Desserts", slug: "desserts", type: "DESSERT", position: 4 },
  { name: "Accompagnements", slug: "accompagnements", type: "SIDE", position: 5 },
];

const pizzas: Array<Pick<Prisma.ProductCreateInput, "name" | "slug" | "price" | "shortDesc"> & { badges: string[] }> = [
  { name: "Margherita", slug: "margherita", price: "9.90", shortDesc: "Sauce tomate, mozzarella, basilic", badges: ["populaire", "vegetarien"] },
  { name: "Regina", slug: "regina", price: "11.90", shortDesc: "Tomate, mozzarella, jambon, champignons", badges: [] },
  { name: "4 Fromages", slug: "4-fromages", price: "13.90", shortDesc: "Mozzarella, gorgonzola, chèvre, parmesan", badges: ["premium"] },
  { name: "Diavola", slug: "diavola", price: "12.90", shortDesc: "Salami piquant, olives", badges: ["epice", "populaire"] },
  { name: "Napolitaine", slug: "napolitaine", price: "12.50", shortDesc: "Anchois, câpres, olives, origan", badges: [] },
  { name: "Vegetariana", slug: "vegetarienne", price: "12.90", shortDesc: "Légumes grillés, tomates cerises", badges: ["vegetarien"] },
  { name: "Bufala", slug: "bufala", price: "14.90", shortDesc: "Mozzarella di bufala DOP, basilic", badges: ["premium"] },
  { name: "Frutti di Mare", slug: "fruits-de-mer", price: "15.90", shortDesc: "Fruits de mer, ail, persil", badges: ["nouveau", "premium"] },
];

const menus: Array<Prisma.MenuCreateInput & { _items: string[] }> = [
  { name: "Menu Solo", slug: "menu-solo", price: "12.90", description: "1 pizza, 1 boisson, 1 dessert", availability: "Tous les jours", _items: ["1 pizza au choix", "1 boisson 33cl", "1 tiramisu"] },
  { name: "Menu Duo", slug: "menu-duo", price: "27.90", description: "Pour deux", availability: "Tous les jours", _items: ["2 pizzas", "1 entrée", "2 boissons"] },
  { name: "Menu Famille", slug: "menu-famille", price: "49.90", description: "Pour quatre", availability: "Tous les jours", _items: ["4 pizzas", "2 accompagnements", "1 soda 1,5L", "4 desserts"] },
];

const stock: Prisma.StockItemCreateInput[] = [
  { name: "Mozzarella fior di latte", unit: "kg", quantity: "18", threshold: "8", status: "OK" },
  { name: "Pâte (boules)", unit: "u", quantity: "120", threshold: "50", status: "OK" },
  { name: "Olives noires", unit: "kg", quantity: "3", threshold: "4", status: "LOW" },
  { name: "Pepperoni", unit: "kg", quantity: "2", threshold: "5", status: "LOW" },
];

const promos: Prisma.PromoCodeCreateInput[] = [
  { code: "BIENVENUE10", description: "-10% première commande", type: "PERCENTAGE", value: "10", minOrder: "15", firstOrderOnly: true },
  { code: "LIVRAISON0", description: "Livraison offerte dès 25€", type: "FREE_DELIVERY", value: "0", minOrder: "25" },
];

async function main() {
  console.log("🌱 Seed La Bella…");

  await prisma.restaurantSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "La Bella Pizzeria",
      address: "123 Avenue de l'Italie, 75000 Paris",
      phone: "01 23 45 67 89",
      email: "contact@labellapizzeria.fr",
    },
  });

  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: u });
  }

  const createdCategories = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    createdCategories.set(c.slug, cat.id);
  }

  for (const p of pizzas) {
    const categoryId = createdCategories.get(p.badges.includes("premium") ? "pizzas-premium" : "pizzas-classiques");
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        shortDesc: p.shortDesc,
        badges: p.badges,
        type: "PIZZA",
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
    });
  }

  for (const { _items, ...m } of menus) {
    await prisma.menu.upsert({
      where: { slug: m.slug },
      update: {},
      create: { ...m, components: { create: _items.map((label) => ({ label })) } },
    });
  }

  for (const s of stock) {
    await prisma.stockItem.create({ data: s });
  }
  for (const p of promos) {
    await prisma.promoCode.upsert({ where: { code: p.code }, update: {}, create: p });
  }

  // Horaires (lun→dim, 11h–23h)
  for (let day = 0; day < 7; day++) {
    await prisma.openingHour.create({
      data: { dayOfWeek: day, kind: "dining", opensAt: "11:00", closesAt: "23:00" },
    });
  }

  // --- Clients, fidélité & commandes ---
  const firstNames = ["Camille", "Marco", "Sarah", "Julien", "Léa", "Thomas", "Emma", "Lucas", "Chloé", "Hugo", "Inès", "Nathan", "Manon", "Yanis", "Sofia", "Adam", "Jade", "Louis", "Nina", "Rayan"];
  const lastNames = ["Dubois", "Rossi", "Bernard", "Martin", "Moreau", "Lefèvre", "Garcia", "Conti", "Petit", "Roux"];
  const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const seedChannels = ["DELIVERY", "PICKUP", "DINE_IN"] as const;
  let orderSeq = 0;

  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 3) % lastNames.length];
    const ordersCount = 1 + (i % 4);
    const tags =
      i % 7 === 0 ? ["VIP"] : i % 3 === 0 ? ["Client fidèle"] : ordersCount === 1 ? ["Nouveau client"] : ["Livraison fréquente"];

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        phone: `0610${String(i).padStart(6, "0")}`,
        email: `${slug(firstName)}.${slug(lastName)}${i}@email.fr`,
        tags,
        marketingOptIn: i % 2 === 0,
        smsOptIn: i % 3 === 0,
        loyaltyAccount: {
          create: { points: ordersCount * 25, tier: tags.includes("VIP") ? "Or" : "Bronze" },
        },
      },
    });

    for (let j = 0; j < ordersCount; j++) {
      orderSeq += 1;
      const dayOffset = (i + j) % 20;
      const channel = seedChannels[(i + j) % seedChannels.length];
      const pizza = pizzas[(i + j) % pizzas.length];
      const price = Number(pizza.price);
      const qty = 1 + (j % 2);
      const subtotal = price * qty;
      const deliveryFee = channel === "DELIVERY" ? 2.5 : 0;
      const total = subtotal + deliveryFee;
      const status = dayOffset === 0 ? (j % 2 ? "PREPARING" : "NEW") : "DELIVERED";
      const paid = status === "DELIVERED" || channel !== "DELIVERY";

      await prisma.order.create({
        data: {
          number: `WEB-SEED-${String(orderSeq).padStart(4, "0")}`,
          channel,
          status,
          customerName: `${firstName} ${lastName}`,
          customerPhone: customer.phone,
          deliveryAddress: channel === "DELIVERY" ? `${10 + i} Avenue de l'Italie, 75013 Paris` : null,
          customer: { connect: { id: customer.id } },
          subtotal: subtotal.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          total: total.toFixed(2),
          createdAt: new Date(Date.now() - dayOffset * 86_400_000 - j * 3_600_000),
          items: {
            create: [{ name: pizza.name, unitPrice: price.toFixed(2), quantity: qty, lineTotal: subtotal.toFixed(2) }],
          },
          payment: {
            create: {
              method: channel === "DELIVERY" ? "CARD_ONLINE" : "CASH",
              status: paid ? "PAID" : "PENDING",
              amount: total.toFixed(2),
              paidAt: paid ? new Date() : null,
            },
          },
        },
      });
    }
  }

  // --- Réservations ---
  for (let i = 0; i < 12; i++) {
    const future = i < 8;
    const date = new Date(
      Date.now() + (future ? i + 1 : -(i + 1)) * 86_400_000 + (18 + (i % 4)) * 3_600_000,
    );
    await prisma.reservation.create({
      data: {
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        phone: `0720${String(i).padStart(6, "0")}`,
        email: `resa${i}@email.fr`,
        date,
        partySize: 2 + (i % 6),
        status: future ? (i % 3 === 0 ? "PENDING" : "CONFIRMED") : "ARRIVED",
        note: i % 4 === 0 ? "Table près de la fenêtre" : null,
      },
    });
  }

  // --- Avis ---
  const reviewComments = [
    "Excellente pizza, pâte parfaite !",
    "Livraison rapide et chaude, top.",
    "Un régal en famille, on recommande.",
    "Très bon rapport qualité-prix.",
  ];
  const reviewRatings = [5, 5, 4, 5, 4, 3];
  for (let i = 0; i < 6; i++) {
    await prisma.review.create({
      data: {
        authorName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length].charAt(0)}.`,
        rating: reviewRatings[i],
        comment: reviewComments[i % reviewComments.length],
        status: i < 2 ? "PENDING" : "PUBLISHED",
      },
    });
  }

  console.log("✅ Seed terminé : 40 clients, ~100 commandes, 12 réservations, 6 avis.");
  console.log(`🔑 Comptes admin créés. Mot de passe initial : "${SEED_PASSWORD}" — À CHANGER.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
