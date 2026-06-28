import type { Category } from "@/lib/types";

/** Catégories de la carte — utilisées pour le filtrage et les ancres. */
export const categories: Category[] = [
  {
    id: "cat-pizzas",
    label: "Pizzas",
    slug: "pizzas",
    description: "Nos pizzas artisanales cuites au feu de bois.",
    icon: "pizza",
  },
  {
    id: "cat-menus",
    label: "Menus",
    slug: "menus",
    description: "Nos formules complètes pour toutes les envies.",
    icon: "utensils",
  },
  {
    id: "cat-salades",
    label: "Salades & accompagnements",
    slug: "accompagnements",
    description: "Fraîcheur et gourmandise en accompagnement.",
    icon: "salad",
  },
  {
    id: "cat-desserts",
    label: "Desserts",
    slug: "desserts",
    description: "La douceur italienne pour finir en beauté.",
    icon: "cake",
  },
  {
    id: "cat-boissons",
    label: "Boissons",
    slug: "boissons",
    description: "Sodas, eaux et boissons italiennes.",
    icon: "cup",
  },
];
