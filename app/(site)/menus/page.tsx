import type { Metadata } from "next";
import { formulas } from "@/data/menus";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MenuHighlightCard } from "@/components/MenuHighlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { MenuSlider } from "@/components/MenuSlider";

export const metadata: Metadata = {
  title: "Nos menus",
  description:
    "Formules midi, menus duo, famille, étudiant et enfant : des combos pizza + boisson + dessert à prix doux chez La Bella Pizzeria.",
};

/** Page Menus : présentation des formules combinées. */
export default function MenusPage() {
  return (
    <>
      <PageHero
        eyebrow="Bon plan"
        title="Nos menus"
        subtitle="Des formules complètes pour tous les moments : seul, en duo, en famille ou le midi en semaine."
        image="/images/pizzeria/06_menu_pizza_boisson_salade.png"
      />

      {/* Mobile : slider plein écran (une formule par vue) */}
      <MenuSlider />

      {/* Tablette + desktop : grille complète */}
      <section className="hidden bg-paper py-8 md:block md:py-12 lg:py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="Composez votre repas"
            title="Toutes nos formules"
            subtitle="Chaque menu peut être personnalisé. Pizzas au choix dans toute notre carte."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {formulas.map((formula, i) => (
              <Reveal key={formula.id} delay={i * 60}>
                <MenuHighlightCard formula={formula} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bannière livraison */}
      <section className="bg-cream-100 pb-10 lg:pb-20">
        <div className="container-page">
          <DeliveryBanner className="min-h-[16rem]" />
        </div>
      </section>
    </>
  );
}
