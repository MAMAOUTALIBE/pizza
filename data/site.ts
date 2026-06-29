import type { OpeningHour, SocialLink } from "@/lib/types";

/**
 * Configuration centrale de la marque et coordonnées.
 * Source unique de vérité réutilisée par le header, le footer, la page contact
 * et les métadonnées SEO. (À terme : alimenté par RestaurantSetting côté CRM.)
 */
export const site = {
  name: "La Bella",
  fullName: "La Bella Pizzeria",
  tagline: "Le goût de l'Italie, chez vous !",
  description:
    "Pizzas artisanales préparées avec des ingrédients frais et cuites au feu de bois. Livraison rapide 7j/7 à domicile ou au bureau.",
  phone: "01 23 45 67 89",
  phoneHref: "tel:+33123456789",
  email: "contact@labellapizzeria.fr",
  address: {
    street: "123 Avenue de l'Italie",
    zip: "75000",
    city: "Paris",
    full: "123 Avenue de l'Italie, 75000 Paris",
  },
  // Coordonnées approximatives (place de l'Italie, Paris) pour la carte intégrée.
  geo: { lat: 48.8312, lng: 2.3559 },
  // URL publique — surchargée par NEXT_PUBLIC_SITE_URL en production (inlinée au build).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://labellapizzeria.fr",
} as const;

/** Navigation principale (header + footer). */
export const mainNav = [
  { label: "Accueil", href: "/" },
  { label: "Notre carte", href: "/notre-carte" },
  { label: "Nos pizzas", href: "/nos-pizzas" },
  { label: "Menus", href: "/menus" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

export const openingHours: OpeningHour[] = [
  { day: "Lundi", hours: "11h00 – 23h00" },
  { day: "Mardi", hours: "11h00 – 23h00" },
  { day: "Mercredi", hours: "11h00 – 23h00" },
  { day: "Jeudi", hours: "11h00 – 23h00" },
  { day: "Vendredi", hours: "11h00 – 00h00" },
  { day: "Samedi", hours: "11h00 – 00h00" },
  { day: "Dimanche", hours: "11h00 – 23h00" },
];

/** Résumé court affiché dans le footer / la hero. */
export const hoursSummary = "Ouvert 7j/7 · 11h00 – 23h00";

export const socials: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
];

/** Arguments de réassurance affichés sous la hero. */
export const heroFeatures = [
  {
    icon: "leaf",
    title: "Ingrédients frais",
    description: "Sélectionnés chaque jour",
  },
  {
    icon: "flame",
    title: "Cuisson au feu de bois",
    description: "Pour un goût authentique",
  },
  {
    icon: "truck",
    title: "Livraison rapide",
    description: "À domicile ou au bureau",
  },
] as const;
