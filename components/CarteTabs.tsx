"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { pizzas } from "@/data/pizzas";
import { formulas } from "@/data/menus";
import { getItemsByCategory } from "@/data/menu-items";
import { formatPrice } from "@/lib/utils";
import { PizzaCard } from "@/components/PizzaCard";
import { MenuListItem } from "@/components/MenuListItem";
import { FilterChips } from "@/components/ui/FilterChips";

const tabs = [
  { label: "Pizzas", value: "pizzas" },
  { label: "Menus", value: "menus" },
  { label: "Accompagnements", value: "accompagnements" },
  { label: "Desserts", value: "desserts" },
  { label: "Boissons", value: "boissons" },
];

/** Carte condensée en onglets de catégories (mobile/tablette) — une vue à la fois. */
export function CarteTabs() {
  const [active, setActive] = useState("pizzas");

  return (
    <section className="bg-paper py-6 lg:hidden">
      {/* Onglets de catégories — défilables, sticky sous le header */}
      <div className="sticky top-20 z-30 -mt-6 bg-cream-100/95 py-3 backdrop-blur">
        <div className="container-page">
          <FilterChips items={tabs} active={active} onSelect={setActive} />
        </div>
      </div>

      <div key={active} className="container-page mt-4 animate-fade-up-sm">
        {active === "pizzas" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {pizzas.map((p) => (
              <PizzaCard key={p.id} pizza={p} />
            ))}
          </div>
        )}

        {active === "menus" && (
          <div className="grid gap-3 md:grid-cols-2">
            {formulas.map((f) => (
              <Link
                key={f.id}
                href="/menus"
                className="flex gap-3 rounded-2xl bg-white p-3 shadow-card active:scale-[0.99]"
              >
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                  <Image src={f.image} alt="" fill className="object-cover" sizes="80px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold uppercase tracking-tight text-charcoal-900">{f.name}</span>
                    <span className="shrink-0 font-bold text-terracotta-600">{formatPrice(f.price)}</span>
                  </span>
                  <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {f.items.slice(0, 3).map((it) => (
                      <span key={it} className="flex items-center gap-1 text-xs text-charcoal-800/60">
                        <Check className="h-3 w-3 text-basil-500" aria-hidden /> {it}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {(active === "accompagnements" || active === "desserts" || active === "boissons") && (
          <div className="divide-y divide-cream-200 rounded-2xl bg-white px-4 shadow-card md:mx-auto md:max-w-2xl">
            {getItemsByCategory(active).map((item) => (
              <MenuListItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
