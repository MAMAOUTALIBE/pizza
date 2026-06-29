import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { mainNav, site, socials, hoursSummary } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialIcons } from "@/components/ui/SocialIcons";

/** Pied de page complet : marque, liens, infos pratiques, réseaux, mentions. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal-950 text-cream-100">
      {/* Visuel four à bois en filigrane à droite */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-25 lg:block">
        <Image
          src="/images/pizzeria/09_four_a_bois_pizza.png"
          alt=""
          fill
          sizes="33vw"
          className="object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 to-transparent" />
      </div>

      {/* --- Footer COMPACT (mobile/tablette) --- */}
      <div className="container-page relative flex flex-col items-center gap-3 py-6 text-center lg:hidden">
        <Logo tone="dark" />
        <SocialIcons links={socials} />
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-cream-200/75">
          <a href={site.phoneHref} className="flex items-center gap-1.5 hover:text-cream-50">
            <Phone className="h-4 w-4 text-terracotta-400" aria-hidden /> {site.phone}
          </a>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-terracotta-400" aria-hidden /> {hoursSummary}
          </span>
        </div>
      </div>

      {/* --- Footer COMPLET (desktop) --- */}
      <div className="container-page relative hidden gap-10 py-14 lg:grid lg:grid-cols-4">
        {/* Marque */}
        <div className="space-y-4">
          <Logo tone="dark" />
          <p className="max-w-xs text-sm text-cream-200/70">{site.tagline}</p>
          <SocialIcons links={socials} />
        </div>

        {/* Liens rapides */}
        <nav aria-label="Liens rapides">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
            Liens rapides
          </h2>
          <ul className="mt-4 space-y-2.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream-200/70 transition-colors hover:text-terracotta-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Infos pratiques */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
            Infos pratiques
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-cream-200/70">
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-400" aria-hidden />
              <span>{hoursSummary}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-400" aria-hidden />
              <a href={site.phoneHref} className="transition-colors hover:text-cream-50">
                {site.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-400" aria-hidden />
              <span>
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter / CTA léger */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
            Une petite faim ?
          </h2>
          <p className="mt-4 text-sm text-cream-200/70">
            Commandez en quelques clics et régalez-vous en moins de 30 minutes.
          </p>
          <Link
            href="/commander"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600"
          >
            Commander en ligne
          </Link>
        </div>
      </div>

      {/* Bas de footer */}
      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-3 text-xs text-cream-200/60 sm:flex-row sm:py-5">
          <p>
            © {new Date().getFullYear()} {site.fullName} — Tous droits réservés
          </p>
          <div className="flex items-center gap-5">
            <Link href="/mentions-legales" className="transition-colors hover:text-cream-50">
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="transition-colors hover:text-cream-50"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
