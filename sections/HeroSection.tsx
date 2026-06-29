import Image from "next/image";
import Link from "next/link";
import { Flame, Leaf, Truck, Pizza as PizzaIcon, UtensilsCrossed } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { FeatureItem } from "@/components/FeatureItem";

const features = [
  { icon: Leaf, title: "Ingrédients frais", description: "Sélectionnés chaque jour", href: "/a-propos" },
  { icon: Flame, title: "Cuisson feu de bois", description: "Goût authentique", href: "/a-propos" },
  { icon: Truck, title: "Livraison rapide", description: "À domicile / au bureau", href: "/commander" },
];

/** Hero d'accueil : visuel fort, titre script + condensé, double CTA, réassurance. */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-charcoal-950 text-cream-50">
      {/* Fond : four à bois en ambiance */}
      <Image
        src="/images/pizzeria/01_hero_pizza_premium.png"
        alt=""
        fill
        priority
        className="object-cover opacity-60"
        aria-hidden
      />
      <div className="absolute inset-0 bg-hero-fade" aria-hidden />

      {/* --- Hero MOBILE + TABLETTE (app-like, court et visuel) --- */}
      <div className="container-page relative flex flex-col items-center pb-8 pt-24 text-center md:pb-12 md:pt-28 lg:hidden">
        <div className="relative h-56 w-56 animate-fade-up md:h-72 md:w-72">
          <Image
            src="/images/pizzeria/02_pizza_margherita.png"
            alt="Pizza artisanale La Bella"
            fill
            priority
            sizes="(min-width: 768px) 288px, 224px"
            className="rounded-full object-cover shadow-2xl"
          />
          <span className="absolute -bottom-1 -right-1 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-cream-50/30 bg-charcoal-950/85 text-center backdrop-blur">
            <span className="font-script text-sm leading-tight text-terracotta-400">Fait</span>
            <span className="font-script text-sm leading-tight text-terracotta-400">maison</span>
          </span>
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] text-cream-50 sm:text-5xl md:mt-8 md:text-6xl">
          Pizza <span className="text-gradient-warm">artisanale</span>
        </h1>
        <p className="mt-2 text-base text-cream-200/85 md:text-lg">Chaude, fraîche, prête à commander.</p>

        <div className="mt-6 flex w-full max-w-xs flex-col gap-3 md:mt-8 md:max-w-sm">
          <CTAButton href="/commander" size="lg" className="w-full">
            <PizzaIcon className="h-5 w-5" aria-hidden />
            Commander
          </CTAButton>
          <CTAButton href="/notre-carte" size="lg" variant="outline" className="w-full">
            <UtensilsCrossed className="h-5 w-5" aria-hidden />
            Voir la carte
          </CTAButton>
        </div>

        {/* Réassurance — boutons premium « glass » tappables */}
        <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-2.5 md:max-w-md md:gap-3">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-200 hover:border-terracotta-500/40 hover:bg-white/[0.1] active:scale-95"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-400 to-tomato-600 text-white shadow-glow transition-transform duration-200 group-hover:scale-105">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-center text-[0.62rem] font-bold uppercase leading-tight tracking-wide text-cream-50 md:text-xs">
                {f.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* --- Hero DESKTOP (inchangé) --- */}
      <div className="container-page relative hidden items-center gap-10 pb-16 pt-32 sm:pt-36 lg:grid lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-40">
        {/* Texte */}
        <div className="max-w-xl animate-fade-up">
          <p className="font-script text-3xl text-cream-50 sm:text-4xl">
            Le goût
          </p>
          <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-[0.95] sm:text-6xl lg:text-7xl 2xl:text-8xl">
            <span className="text-gradient-warm">De l&apos;Italie</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-cream-200/85 sm:text-lg">
            Des pizzas artisanales préparées avec des ingrédients frais et de
            qualité, cuites au feu de bois.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href="/commander" size="lg">
              <PizzaIcon className="h-5 w-5" aria-hidden />
              Commander en ligne
            </CTAButton>
            <CTAButton href="/notre-carte" size="lg" variant="outline">
              <UtensilsCrossed className="h-5 w-5" aria-hidden />
              Voir le menu
            </CTAButton>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 sm:gap-10">
            {features.map((f) => (
              <FeatureItem
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>
        </div>

        {/* Visuel pizza + tampon */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-lg lg:block 2xl:max-w-xl">
          <div className="absolute inset-0 animate-float">
            <Image
              src="/images/pizzeria/02_pizza_margherita.png"
              alt="Pizza Margherita artisanale de La Bella"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 40vw"
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          {/* Tampon « Fait maison » */}
          <div className="absolute -bottom-2 -left-2 flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-cream-50/30 bg-charcoal-950/85 text-center backdrop-blur">
            <span className="text-[0.55rem] uppercase tracking-[0.25em] text-cream-200/70">
              Pâte fraîche
            </span>
            <span className="font-script text-xl leading-tight text-terracotta-400">
              Fait maison
            </span>
            <span className="text-[0.55rem] uppercase tracking-[0.25em] text-cream-200/70">
              tous les jours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
