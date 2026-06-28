"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredPizzas } from "@/data/pizzas";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PizzaCard } from "@/components/PizzaCard";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";

// Raccourcis de catégories (filtres rapides) vers la carte.
const quickFilters = [
  { label: "Toutes", href: "/nos-pizzas" },
  { label: "Classiques", href: "/nos-pizzas" },
  { label: "Fromage", href: "/nos-pizzas" },
  { label: "Épicées", href: "/nos-pizzas" },
  { label: "Menus", href: "/menus" },
  { label: "Boissons", href: "/notre-carte#boissons" },
];

/**
 * Section catalogue d'accueil : carrousel horizontal des pizzas vedettes
 * avec flèches de navigation (et défilement tactile / souris natif).
 */
export function PizzasSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="nos-pizzas" className="bg-paper py-20 lg:py-24">
      <div className="container-page">
        <SectionTitle
          eyebrow="Découvrez"
          title="Nos pizzas"
          subtitle="Une sélection de nos pizzas signatures, préparées à la commande et cuites au feu de bois."
        />

        {/* Filtres rapides (raccourcis vers la carte) */}
        <div className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {quickFilters.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full border border-charcoal-900/15 bg-white px-4 text-sm font-medium text-charcoal-800/80 transition-all hover:border-terracotta-500/50 hover:text-terracotta-600 active:scale-95"
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="relative mt-8">
          {/* Flèches (desktop) */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Pizzas précédentes"
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-900 p-3 text-cream-50 shadow-lg transition-transform hover:scale-105 lg:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Pizzas suivantes"
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-900 p-3 text-cream-50 shadow-lg transition-transform hover:scale-105 lg:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          {/* Piste de défilement */}
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
          >
            {featuredPizzas.map((pizza, i) => (
              <Reveal
                key={pizza.id}
                delay={i * 60}
                className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-15px)]"
              >
                <PizzaCard pizza={pizza} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton href="/nos-pizzas" size="lg">
            Voir toutes nos pizzas
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
