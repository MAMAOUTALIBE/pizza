import type { Testimonial } from "@/lib/types";

/** Avis clients (données mockées) affichés sur l'accueil et la page À propos. */
export const testimonials: Testimonial[] = [
  {
    id: "av-1",
    name: "Camille D.",
    rating: 5,
    comment:
      "La meilleure pizza du quartier ! La pâte est légère et bien cuite, on sent le feu de bois. Livraison toujours rapide et chaude.",
    location: "Paris 13e",
  },
  {
    id: "av-2",
    name: "Marco T.",
    rating: 5,
    comment:
      "Une vraie Margherita comme en Italie. Les ingrédients sont frais et de qualité, ça change tout. Je recommande les yeux fermés.",
    location: "Paris 5e",
  },
  {
    id: "av-3",
    name: "Sarah B.",
    rating: 4,
    comment:
      "Très bon rapport qualité-prix, surtout le menu midi. L'équipe est adorable et l'ambiance vraiment chaleureuse.",
    location: "Ivry-sur-Seine",
  },
  {
    id: "av-4",
    name: "Julien M.",
    rating: 5,
    comment:
      "On commande chaque vendredi soir en famille. Le menu famille est parfait et les enfants adorent. Service impeccable.",
    location: "Paris 12e",
  },
];

/** Note moyenne calculée pour l'affichage « 4,9/5 ». */
export const averageRating =
  Math.round(
    (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) *
      10,
  ) / 10;
