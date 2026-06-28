import type { Formula } from "@/lib/types";

/** Formules / menus combinés (données mockées). */
export const formulas: Formula[] = [
  {
    id: "menu-solo",
    name: "Menu Solo",
    description: "La formule parfaite pour une pause gourmande en solo.",
    price: 12.9,
    items: ["1 pizza au choix", "1 boisson 33cl", "1 part de tiramisu"],
    image: "/images/pizzeria/06_menu_pizza_boisson_salade.png",
    availability: "Tous les jours",
    badge: "À partir de",
    popular: true,
  },
  {
    id: "menu-midi",
    name: "Menu Midi",
    description: "Pizza + boisson + café, servi du lundi au vendredi le midi.",
    price: 11.5,
    items: ["1 pizza classique", "1 boisson 33cl", "1 café"],
    image: "/images/pizzeria/02_pizza_margherita.png",
    availability: "Lun–Ven, 11h–14h30",
    badge: "Offre midi",
  },
  {
    id: "menu-duo",
    name: "Menu Duo",
    description: "À partager à deux : deux pizzas, une entrée et des boissons.",
    price: 27.9,
    items: ["2 pizzas au choix", "1 salade ou bruschetta", "2 boissons 33cl"],
    image: "/images/pizzeria/06_menu_pizza_boisson_salade.png",
    availability: "Tous les jours",
    popular: true,
  },
  {
    id: "menu-famille",
    name: "Menu Famille",
    description: "Le festin idéal pour 4 : pizzas, accompagnements et desserts.",
    price: 49.9,
    items: ["4 pizzas au choix", "2 accompagnements", "1 bouteille de soda 1,5L", "4 desserts"],
    image: "/images/pizzeria/01_hero_pizza_premium.png",
    availability: "Tous les jours",
    badge: "Meilleure valeur",
  },
  {
    id: "menu-etudiant",
    name: "Menu Étudiant",
    description: "Sur présentation de la carte étudiante : pizza + boisson.",
    price: 9.9,
    items: ["1 pizza classique", "1 boisson 33cl"],
    image: "/images/pizzeria/03_pizza_regina_jambon_champignons.png",
    availability: "Lun–Ven, hors soir",
  },
  {
    id: "menu-enfant",
    name: "Menu Enfant",
    description: "Une formule pensée pour les plus petits gourmands.",
    price: 8.5,
    items: ["1 mini pizza", "1 jus de fruits", "1 compote", "1 surprise"],
    image: "/images/pizzeria/04_pizza_quatre_fromages.png",
    availability: "Tous les jours",
  },
];

/** Prix d'appel le plus bas pour la section « Nos menus » de l'accueil. */
export const menusStartingPrice = Math.min(...formulas.map((f) => f.price));
