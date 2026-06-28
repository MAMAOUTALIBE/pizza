"use client";

import { useMemo, useState } from "react";
import type { Pizza, PizzaTag } from "@/lib/types";
import { PizzaCard } from "@/components/PizzaCard";
import { FilterChips } from "@/components/ui/FilterChips";

const TAGS: (PizzaTag | "Toutes")[] = [
  "Toutes",
  "Classique",
  "Végétarienne",
  "Épicée",
  "Premium",
  "Nouveauté",
];

/**
 * Grille de pizzas filtrable par tag (page Nos pizzas).
 * Le filtrage est instantané côté client sur les données mockées.
 */
export function PizzaFilterGrid({ pizzas }: { pizzas: Pizza[] }) {
  const [active, setActive] = useState<(typeof TAGS)[number]>("Toutes");

  const filtered = useMemo(() => {
    if (active === "Toutes") return pizzas;
    return pizzas.filter((p) => p.tags.includes(active as PizzaTag));
  }, [active, pizzas]);

  return (
    <div>
      {/* Filtres (chips défilables sur mobile) */}
      <FilterChips
        items={TAGS.map((t) => ({ label: t, value: t }))}
        active={active}
        onSelect={(v) => setActive(v as (typeof TAGS)[number])}
      />

      {/* Grille */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} showTags />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-charcoal-800/60">
          Aucune pizza ne correspond à ce filtre pour le moment.
        </p>
      )}
    </div>
  );
}
