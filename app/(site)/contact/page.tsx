import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Navigation, Pizza } from "lucide-react";
import { site, openingHours } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/ContactForm";
import { CTAButton } from "@/components/ui/CTAButton";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { socials } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez La Bella Pizzeria : adresse, téléphone, horaires d'ouverture et formulaire de contact. Commande et réservation 7j/7.",
};

// URL OpenStreetMap (sans clé) centrée sur le restaurant.
const { lat, lng } = site.geo;
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.004}%2C${lng + 0.008}%2C${lat + 0.004}&layer=mapnik&marker=${lat}%2C${lng}`;
const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.full)}`;

/** Page Contact : infos pratiques, formulaire, carte. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="On vous écoute"
        title="Contact"
        subtitle="Une question, une réservation, un événement à organiser ? Écrivez-nous ou passez nous voir."
        image="/images/pizzeria/01_hero_pizza_premium.png"
      />

      <section className="bg-paper py-8 lg:py-20">
        {/* Actions rapides — visibles immédiatement */}
        <div className="container-page mb-8 grid grid-cols-3 gap-2 sm:mx-auto sm:max-w-md lg:hidden">
          <a
            href={site.phoneHref}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 text-xs font-semibold text-charcoal-900 shadow-card transition-transform active:scale-95"
          >
            <Phone className="h-5 w-5 text-terracotta-500" aria-hidden /> Appeler
          </a>
          <a
            href={mapsDir}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-2xl bg-white py-3 text-xs font-semibold text-charcoal-900 shadow-card transition-transform active:scale-95"
          >
            <Navigation className="h-5 w-5 text-basil-500" aria-hidden /> Itinéraire
          </a>
          <Link
            href="/commander"
            className="flex flex-col items-center gap-1 rounded-2xl bg-terracotta-500 py-3 text-xs font-semibold text-white shadow-glow transition-transform active:scale-95"
          >
            <Pizza className="h-5 w-5" aria-hidden /> Commander
          </Link>
        </div>

        <div className="container-page grid gap-10 lg:grid-cols-2">
          {/* Coordonnées */}
          <div>
            <SectionTitle
              eyebrow="Nos coordonnées"
              title="Venez nous voir"
              align="left"
            />

            <ul className="mt-8 space-y-5">
              <InfoRow icon={MapPin} title="Adresse">
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </InfoRow>
              <InfoRow icon={Phone} title="Téléphone">
                <a href={site.phoneHref} className="hover:text-terracotta-600">
                  {site.phone}
                </a>
              </InfoRow>
              <InfoRow icon={Mail} title="Email">
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-terracotta-600"
                >
                  {site.email}
                </a>
              </InfoRow>
              <InfoRow icon={Clock} title="Horaires d'ouverture">
                <ul className="mt-1 space-y-0.5">
                  {openingHours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-6">
                      <span>{h.day}</span>
                      <span className="text-charcoal-800/60">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </InfoRow>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CTAButton href="/commander" size="lg">
                Commander en ligne
              </CTAButton>
              <div className="rounded-full bg-charcoal-900 p-1.5">
                <SocialIcons links={socials} />
              </div>
            </div>

            {/* Carte */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-cream-200 shadow-card">
              <iframe
                title="Carte de localisation de La Bella Pizzeria"
                src={mapSrc}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Formulaire */}
          <div>
            <SectionTitle
              eyebrow="Écrivez-nous"
              title="Un message ?"
              align="left"
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-500/12 text-terracotta-500">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="text-sm text-charcoal-800/80">
        <h3 className="font-semibold text-charcoal-900">{title}</h3>
        <div className="mt-0.5">{children}</div>
      </div>
    </li>
  );
}
