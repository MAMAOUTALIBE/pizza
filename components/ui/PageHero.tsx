import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Bandeau d'en-tête sombre réutilisé en haut des pages internes.
 * Inclut le dégagement nécessaire sous le header fixe.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image = "/images/pizzeria/01_hero_pizza_premium.png",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-charcoal-950 text-cream-50">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-40"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/85 to-charcoal-950" aria-hidden />

      <div className="container-page relative flex flex-col items-center pb-16 pt-36 text-center sm:pt-40">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-cream-200/80 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
