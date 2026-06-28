import type { Pizza } from "@/lib/types";

/**
 * Catalogue des pizzas (données mockées).
 * `image` : photo réelle du pack (/images/pizzeria/*.png) quand elle existe,
 * sinon illustration dédiée (/images/pizzeria/pizzas/*.svg) — à remplacer par
 * une vraie photo en déposant le fichier et en mettant à jour ce chemin.
 * Prix en euros.
 */
export const pizzas: Pizza[] = [
  {
    id: "pz-margherita",
    slug: "margherita",
    name: "Margherita",
    description: "Sauce tomate, mozzarella fior di latte, basilic frais",
    price: 9.9,
    image: "/images/pizzeria/02_pizza_margherita.png",
    ingredients: ["Sauce tomate", "Mozzarella fior di latte", "Basilic frais", "Huile d'olive"],
    tags: ["Classique", "Végétarienne"],
    badge: "Best-seller",
    featured: true,
  },
  {
    id: "pz-regina",
    slug: "regina",
    name: "Regina",
    description: "Sauce tomate, mozzarella, jambon, champignons",
    price: 11.9,
    image: "/images/pizzeria/03_pizza_regina_jambon_champignons.png",
    ingredients: ["Sauce tomate", "Mozzarella", "Jambon", "Champignons frais"],
    tags: ["Classique"],
    featured: true,
  },
  {
    id: "pz-4-fromages",
    slug: "4-fromages",
    name: "4 Fromages",
    description: "Sauce tomate, mozzarella, gorgonzola, chèvre, parmesan",
    price: 13.9,
    image: "/images/pizzeria/04_pizza_quatre_fromages.png",
    ingredients: ["Sauce tomate", "Mozzarella", "Gorgonzola", "Chèvre", "Parmesan", "Noix"],
    tags: ["Végétarienne", "Premium"],
    badge: "Signature",
    featured: true,
  },
  {
    id: "pz-diavola",
    slug: "diavola",
    name: "Diavola",
    description: "Sauce tomate, mozzarella, salami piquant, olives",
    price: 12.9,
    image: "/images/pizzeria/05_pizza_diavola_pepperoni.png",
    ingredients: ["Sauce tomate", "Mozzarella", "Salami piquant", "Olives noires", "Piment"],
    tags: ["Épicée", "Classique"],
    badge: "Best-seller",
    featured: true,
  },
  {
    id: "pz-napolitaine",
    slug: "napolitaine",
    name: "Napolitaine",
    description: "Sauce tomate, mozzarella, anchois, câpres, olives, origan",
    price: 12.5,
    image: "/images/pizzeria/pizzas/napolitaine.svg",
    ingredients: ["Sauce tomate", "Mozzarella", "Anchois", "Câpres", "Olives", "Origan"],
    tags: ["Classique"],
    featured: true,
  },
  {
    id: "pz-vegetarienne",
    slug: "vegetarienne",
    name: "Vegetariana",
    description: "Sauce tomate, mozzarella, poivrons, courgettes, aubergines, tomates cerises",
    price: 12.9,
    image: "/images/pizzeria/pizzas/vegetarienne.svg",
    ingredients: ["Sauce tomate", "Mozzarella", "Poivrons", "Courgettes", "Aubergines", "Tomates cerises"],
    tags: ["Végétarienne"],
    featured: true,
  },
  {
    id: "pz-pepperoni",
    slug: "pepperoni",
    name: "Pepperoni",
    description: "Sauce tomate, mozzarella, double pepperoni, origan",
    price: 12.9,
    image: "/images/pizzeria/pizzas/pepperoni.svg",
    ingredients: ["Sauce tomate", "Mozzarella", "Double pepperoni", "Origan"],
    tags: ["Épicée", "Classique"],
    badge: "Best-seller",
  },
  {
    id: "pz-bufala",
    slug: "bufala",
    name: "Bufala",
    description: "Sauce tomate, mozzarella di bufala DOP, tomates cerises, basilic",
    price: 14.9,
    image: "/images/pizzeria/01_hero_pizza_premium.png",
    ingredients: ["Sauce tomate", "Mozzarella di bufala DOP", "Tomates cerises", "Basilic", "Huile d'olive"],
    tags: ["Premium", "Végétarienne"],
    badge: "Signature",
  },
  {
    id: "pz-chevre-miel",
    slug: "chevre-miel",
    name: "Chèvre Miel",
    description: "Crème fraîche, mozzarella, chèvre, miel, noix, roquette",
    price: 13.5,
    image: "/images/pizzeria/pizzas/chevre-miel.svg",
    ingredients: ["Crème fraîche", "Mozzarella", "Chèvre", "Miel", "Noix", "Roquette"],
    tags: ["Végétarienne", "Premium"],
  },
  {
    id: "pz-calzone",
    slug: "calzone",
    name: "Calzone",
    description: "Chausson garni : sauce tomate, mozzarella, jambon, œuf, champignons",
    price: 13.5,
    image: "/images/pizzeria/pizzas/calzone.svg",
    ingredients: ["Sauce tomate", "Mozzarella", "Jambon", "Œuf", "Champignons"],
    tags: ["Classique"],
  },
  {
    id: "pz-campagnarde",
    slug: "campagnarde",
    name: "Campagnarde",
    description: "Crème fraîche, mozzarella, lardons, pommes de terre, oignons",
    price: 13.9,
    image: "/images/pizzeria/pizzas/campagnarde.svg",
    ingredients: ["Crème fraîche", "Mozzarella", "Lardons", "Pommes de terre", "Oignons"],
    tags: ["Classique"],
  },
  {
    id: "pz-fruits-de-mer",
    slug: "fruits-de-mer",
    name: "Frutti di Mare",
    description: "Sauce tomate, mozzarella, fruits de mer, ail, persil, citron",
    price: 15.9,
    image: "/images/pizzeria/pizzas/fruits-de-mer.svg",
    ingredients: ["Sauce tomate", "Mozzarella", "Fruits de mer", "Ail", "Persil", "Citron"],
    tags: ["Premium"],
    badge: "Nouveau",
  },
];

/** Pizzas mises en avant sur la page d'accueil. */
export const featuredPizzas = pizzas.filter((p) => p.featured);

/** Recherche d'une pizza par slug (pour les futures pages détail). */
export function getPizzaBySlug(slug: string): Pizza | undefined {
  return pizzas.find((p) => p.slug === slug);
}
