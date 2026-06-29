import type { Metadata } from "next";
import { Truck, ShoppingBag, Store, Phone, Info } from "lucide-react";
import { pizzas } from "@/data/pizzas";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PizzaCard } from "@/components/PizzaCard";
import { CTAButton } from "@/components/ui/CTAButton";
import { CartSummary } from "@/components/cart/CartSummary";
import { MobileCheckout } from "@/components/cart/MobileCheckout";

export const metadata: Metadata = {
  title: "Commander en ligne",
  description:
    "Commandez vos pizzas artisanales chez La Bella : livraison à domicile, retrait sur place ou sur place.",
};

const modes = [
  {
    icon: Truck,
    title: "Livraison",
    text: "Chez vous ou au bureau, en moins de 30 min.",
  },
  {
    icon: ShoppingBag,
    title: "À emporter",
    text: "Commandez et récupérez votre pizza prête.",
  },
  {
    icon: Store,
    title: "Sur place",
    text: "Réservez votre table et dégustez chez nous.",
  },
];

/**
 * Page Commander : choix du mode, panier local et validation de commande.
 */
export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { canceled } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="C'est parti"
        title="Commander en ligne"
        subtitle="Choisissez votre mode de commande, composez votre panier et régalez-vous."
        image="/images/pizzeria/08_livraison_scooter_ambiance_italienne.png"
      />

      {/* Bandeau retour Stripe annulé — panier conservé */}
      {canceled === "1" && (
        <div className="bg-amber-50">
          <div className="container-page py-3">
            <p className="flex items-center gap-2 text-sm text-amber-800">
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              Paiement annulé — votre panier est intact, vous pouvez réessayer
              quand vous le souhaitez.
            </p>
          </div>
        </div>
      )}

      {/* --- Tunnel MOBILE en 3 étapes --- */}
      <section className="bg-cream-100 py-8 lg:hidden">
        <div className="container-page max-w-md md:max-w-lg">
          <h2 className="mb-4 text-center font-display text-2xl font-bold uppercase text-charcoal-900">
            Finaliser ma commande
          </h2>
          <MobileCheckout />
        </div>
      </section>

      {/* Modes de commande (desktop) */}
      <section className="hidden bg-paper py-8 sm:py-14 lg:block">
        <div className="container-page grid gap-5 sm:grid-cols-3">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-card"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-500/12 text-terracotta-500">
                <mode.icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">
                {mode.title}
              </h3>
              <p className="mt-1 text-sm text-charcoal-800/70">{mode.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aperçu du menu (desktop) */}
      <section className="hidden bg-cream-100 py-12 lg:block lg:py-16">
        <div className="container-page">
          <SectionTitle
            eyebrow="Composez votre commande"
            title="Nos pizzas"
            subtitle="Ajoutez vos pizzas préférées, choisissez votre mode puis validez votre commande."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pizzas.map((pizza) => (
                  <PizzaCard key={pizza.id} pizza={pizza} />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <CTAButton href="/notre-carte" variant="ghost" size="lg" className="border border-charcoal-900/15">
                  Voir toute la carte
                </CTAButton>
              </div>
            </div>

            <CartSummary className="h-fit lg:sticky lg:top-28" />
          </div>
        </div>
      </section>

      {/* Commande par téléphone */}
      <section className="bg-charcoal-900 py-8 text-center text-cream-50 sm:py-14">
        <div className="container-page">
          <Phone className="mx-auto h-10 w-10 text-terracotta-400" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold uppercase">
            Commandez par téléphone
          </h2>
          <p className="mx-auto mt-2 max-w-md text-cream-200/75">
            Préférez-vous commander de vive voix ? Appelez-nous, on s&apos;occupe
            du reste.
          </p>
          <CTAButton href={site.phoneHref} size="lg" className="mt-6">
            {site.phone}
          </CTAButton>
        </div>
      </section>
    </>
  );
}
