import type { Metadata } from "next";
import { pizzas } from "@/data/pizzas";
import { PageHero } from "@/components/ui/PageHero";
import { PizzaFilterGrid } from "@/components/PizzaFilterGrid";
import { CTAButton } from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "Nos pizzas",
  description:
    "Découvrez toutes les pizzas artisanales de La Bella : classiques, végétariennes, épicées et premium, cuites au feu de bois.",
};

/** Page dédiée au catalogue complet des pizzas, avec filtres par tag. */
export default function NosPizzasPage() {
  return (
    <>
      <PageHero
        eyebrow="Notre savoir-faire"
        title="Nos pizzas"
        subtitle="Toutes nos pizzas sont préparées à la commande avec une pâte fraîche maison et cuites au feu de bois."
        image="/images/pizzeria/09_four_a_bois_pizza.png"
      />

      <section className="bg-paper py-16 lg:py-20">
        <div className="container-page">
          <PizzaFilterGrid pizzas={pizzas} />
        </div>
      </section>

      {/* CTA bas de page */}
      <section className="bg-charcoal-900 py-16 text-center text-cream-50">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold uppercase">
            Une envie de pizza&nbsp;?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-cream-200/75">
            Commandez en ligne et recevez votre commande chaude en moins de 30
            minutes.
          </p>
          <CTAButton href="/commander" size="lg" className="mt-6">
            Commander en ligne
          </CTAButton>
        </div>
      </section>
    </>
  );
}
