import type { Metadata } from "next";
import { pizzas } from "@/data/pizzas";
import { formulas } from "@/data/menus";
import { getItemsByCategory } from "@/data/menu-items";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PizzaCard } from "@/components/PizzaCard";
import { MenuListItem } from "@/components/MenuListItem";
import { MenuHighlightCard } from "@/components/MenuHighlightCard";

export const metadata: Metadata = {
  title: "Notre carte",
  description:
    "La carte complète de La Bella Pizzeria : pizzas, menus, salades, desserts et boissons.",
};

/** Ancres de navigation par catégorie. */
const sections = [
  { id: "pizzas", label: "Pizzas" },
  { id: "menus", label: "Menus" },
  { id: "accompagnements", label: "Salades & accompagnements" },
  { id: "desserts", label: "Desserts" },
  { id: "boissons", label: "Boissons" },
];

/** Page « Notre carte » : vue large de tous les produits, par catégorie. */
export default function NotreCartePage() {
  return (
    <>
      <PageHero
        eyebrow="À table"
        title="Notre carte"
        subtitle="Pizzas artisanales, menus, accompagnements et douceurs italiennes : tout est fait maison, chaque jour."
        image="/images/pizzeria/07_ingredients_pate_maison.png"
      />

      {/* Navigation par catégories (collante) */}
      <nav
        aria-label="Catégories de la carte"
        className="sticky top-20 z-30 border-b border-cream-200 bg-cream-100/95 backdrop-blur"
      >
        <div className="container-page no-scrollbar flex gap-2 overflow-x-auto py-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-charcoal-800/80 transition-colors hover:bg-terracotta-500 hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Pizzas */}
      <section id="pizzas" className="scroll-mt-36 bg-paper py-16 lg:py-20">
        <div className="container-page">
          <SectionTitle eyebrow="Les incontournables" title="Pizzas" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </div>
      </section>

      {/* Menus */}
      <section id="menus" className="scroll-mt-36 bg-cream-100 py-16 lg:py-20">
        <div className="container-page">
          <SectionTitle eyebrow="Nos formules" title="Menus" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formulas.map((formula) => (
              <MenuHighlightCard key={formula.id} formula={formula} />
            ))}
          </div>
        </div>
      </section>

      {/* Accompagnements + Desserts + Boissons */}
      <section className="bg-paper py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div id="accompagnements" className="scroll-mt-36">
            <SectionTitle
              eyebrow="Fraîcheur"
              title="Salades & accompagnements"
              align="left"
            />
            <div className="mt-6 divide-y divide-cream-200">
              {getItemsByCategory("accompagnements").map((item) => (
                <MenuListItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div id="desserts" className="scroll-mt-36">
            <SectionTitle eyebrow="Gourmandise" title="Desserts" align="left" />
            <div className="mt-6 divide-y divide-cream-200">
              {getItemsByCategory("desserts").map((item) => (
                <MenuListItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div id="boissons" className="scroll-mt-36 lg:col-span-2">
            <SectionTitle eyebrow="Pour accompagner" title="Boissons" align="left" />
            <div className="mt-6 grid gap-x-12 sm:grid-cols-2">
              {getItemsByCategory("boissons").map((item) => (
                <div key={item.id} className="border-b border-cream-200">
                  <MenuListItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
