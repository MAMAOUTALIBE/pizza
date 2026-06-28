/**
 * Types partagés du domaine « La Bella Pizzeria ».
 * Centralisés ici pour garder data/ et components/ alignés et typés.
 */

/** Tags affichés sur les fiches produit (filtrables sur la page Nos pizzas). */
export type PizzaTag =
  | "Classique"
  | "Végétarienne"
  | "Épicée"
  | "Premium"
  | "Nouveauté";

/** Badge promotionnel mis en avant sur une carte (coin supérieur). */
export type ProductBadge = "Best-seller" | "Nouveau" | "Signature" | "Vegan";

export interface Pizza {
  id: string;
  /** Slug stable pour les futures pages détail (/nos-pizzas/[slug]). */
  slug: string;
  name: string;
  description: string;
  /** Prix en euros (taille « senior » par défaut). */
  price: number;
  image: string;
  ingredients: string[];
  tags: PizzaTag[];
  badge?: ProductBadge;
  /** Mise en avant en page d'accueil. */
  featured?: boolean;
}

/** Catégorie de la carte (Pizzas, Boissons, Desserts…). */
export interface Category {
  id: string;
  label: string;
  /** Identifiant utilisé pour le filtrage / les ancres. */
  slug: string;
  description: string;
  icon: string;
}

/** Produit générique de la carte (boissons, desserts, accompagnements). */
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  tags?: string[];
}

/** Formule / menu combiné. */
export interface Formula {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Détail de la composition (« 1 pizza », « 1 boisson 33cl »…). */
  items: string[];
  image: string;
  badge?: string;
  /** Plage horaire de disponibilité (ex. « Midi en semaine »). */
  availability?: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  /** Note sur 5. */
  rating: number;
  comment: string;
  location?: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Nom d'icône lucide-react. */
  icon: "facebook" | "instagram" | "tiktok";
}
