import type { MenuItem } from "@/lib/types";

/**
 * Produits hors pizzas pour la page « Notre carte » :
 * boissons, desserts, salades & accompagnements.
 */
export const menuItems: MenuItem[] = [
  // --- Salades & accompagnements ---
  {
    id: "acc-salade-cesar",
    name: "Salade César",
    description: "Laitue, poulet grillé, parmesan, croûtons, sauce César",
    price: 8.9,
    category: "accompagnements",
    tags: ["Frais"],
  },
  {
    id: "acc-salade-italienne",
    name: "Salade Italienne",
    description: "Mesclun, tomates, mozzarella, olives, basilic, huile d'olive",
    price: 7.9,
    category: "accompagnements",
    tags: ["Végétarien"],
  },
  {
    id: "acc-pain-ail",
    name: "Pain à l'ail",
    description: "Pain croustillant, beurre d'ail et persil, servi avec sauce tomate",
    price: 4.5,
    category: "accompagnements",
  },
  {
    id: "acc-bruschetta",
    name: "Bruschetta",
    description: "Pain grillé, tomates fraîches, ail, basilic et huile d'olive",
    price: 5.9,
    category: "accompagnements",
    tags: ["Végétarien"],
  },

  // --- Desserts ---
  {
    id: "des-tiramisu",
    name: "Tiramisu Maison",
    description: "Mascarpone, café, biscuits et cacao — la recette traditionnelle",
    price: 5.5,
    category: "desserts",
    tags: ["Maison"],
  },
  {
    id: "des-panna-cotta",
    name: "Panna Cotta",
    description: "Crème onctueuse au coulis de fruits rouges",
    price: 4.9,
    category: "desserts",
  },
  {
    id: "des-cannoli",
    name: "Cannoli Siciliens",
    description: "Tubes croustillants garnis de ricotta sucrée et pépites de chocolat",
    price: 5.9,
    category: "desserts",
  },
  {
    id: "des-tarte-citron",
    name: "Tarte au Citron",
    description: "Pâte sablée et crème de citron meringuée",
    price: 4.9,
    category: "desserts",
  },

  // --- Boissons ---
  {
    id: "boi-coca",
    name: "Coca-Cola 33cl",
    price: 2.5,
    category: "boissons",
  },
  {
    id: "boi-san-pellegrino",
    name: "San Pellegrino 50cl",
    description: "Eau pétillante italienne",
    price: 2.9,
    category: "boissons",
  },
  {
    id: "boi-limonata",
    name: "Limonata San Pellegrino",
    description: "Limonade italienne au citron",
    price: 3.2,
    category: "boissons",
  },
  {
    id: "boi-eau-plate",
    name: "Eau plate 50cl",
    price: 2.0,
    category: "boissons",
  },
  {
    id: "boi-jus-orange",
    name: "Jus d'orange pressé",
    price: 3.5,
    category: "boissons",
  },
  {
    id: "boi-cafe",
    name: "Espresso italien",
    price: 1.8,
    category: "boissons",
  },
];

/** Regroupe les produits d'une catégorie de la carte. */
export function getItemsByCategory(slug: string): MenuItem[] {
  return menuItems.filter((item) => item.category === slug);
}
