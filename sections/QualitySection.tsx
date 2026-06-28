import Image from "next/image";
import { Leaf, Hand, Flame, Heart } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  { icon: Leaf, title: "Produits frais", text: "Sélectionnés chaque jour avec soin" },
  { icon: Hand, title: "Pâte maison", text: "Préparée tous les jours sur place" },
  { icon: Flame, title: "Feu de bois", text: "Pour un goût unique et authentique" },
  { icon: Heart, title: "Fait avec amour", text: "Votre satisfaction est notre priorité" },
];

/** Section storytelling / réassurance sur fond sombre. */
export function QualitySection() {
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-20 text-cream-50 lg:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        {/* Visuel ingrédients */}
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card lg:aspect-[5/4]">
          <Image
            src="/images/pizzeria/07_ingredients_pate_maison.png"
            alt="Ingrédients frais : pâte, tomates, mozzarella, basilic"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        {/* Texte + piliers */}
        <div>
          <SectionTitle
            eyebrow="Notre engagement"
            tone="light"
            align="left"
            title={
              <>
                Qualité &amp; <span className="text-gradient-warm">Passion</span>
              </>
            }
            subtitle="Nous sélectionnons les meilleurs ingrédients et préparons chaque pizza avec passion, dans le respect de la tradition italienne."
          />

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal
                key={pillar.title}
                delay={i * 80}
                className="flex items-start gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta-500/15 text-terracotta-400">
                  <pillar.icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wide text-cream-50">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm text-cream-200/70">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
