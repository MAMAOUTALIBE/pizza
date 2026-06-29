import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { menusStartingPrice } from "@/data/menus";
import { CTAButton } from "@/components/ui/CTAButton";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Bloc promotionnel d'accueil : carte « Nos menus » + bannière livraison,
 * côte à côte (cf. maquette).
 */
export function PromoSection() {
  return (
    <section className="bg-cream-100 py-10 lg:py-24">
      <div className="container-page grid gap-6 lg:grid-cols-2">
        {/* Carte Nos menus */}
        <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-charcoal-900 p-8 text-cream-50 shadow-card">
          {/* Badge prix */}
          <div className="absolute right-6 top-6 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-terracotta-500 text-center shadow-lg">
            <span className="text-[0.6rem] uppercase tracking-wide">À partir de</span>
            <span className="font-display text-xl font-bold leading-tight">
              {formatPrice(menusStartingPrice)}
            </span>
          </div>

          <div>
            <h3 className="font-display text-3xl font-bold uppercase tracking-tight">
              Nos menus
            </h3>
            <p className="mt-2 max-w-xs text-cream-200/80">
              Découvrez nos formules complètes pour toutes les envies : solo,
              duo, famille ou menu midi.
            </p>
          </div>

          <div className="relative mt-6 flex items-end justify-between gap-4">
            <CTAButton href="/menus" size="lg" variant="secondary">
              Découvrir les menus
            </CTAButton>
            <div className="relative hidden h-28 w-40 shrink-0 sm:block">
              <Image
                src="/images/pizzeria/06_menu_pizza_boisson_salade.png"
                alt="Formule pizza, boisson et accompagnement"
                fill
                sizes="160px"
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* Bannière livraison */}
        <Reveal delay={100}>
          <DeliveryBanner className="min-h-[20rem]" />
        </Reveal>
      </div>
    </section>
  );
}
