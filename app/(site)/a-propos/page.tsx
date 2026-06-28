import type { Metadata } from "next";
import Image from "next/image";
import { Flame, Leaf, Award, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'histoire de La Bella Pizzeria : une passion familiale, des ingrédients d'exception et le savoir-faire de la cuisson au feu de bois.",
};

const stats = [
  { value: "+15", label: "Ans de passion" },
  { value: "100%", label: "Pâte maison" },
  { value: "+50", label: "Recettes" },
  { value: "4,9/5", label: "Satisfaction client" },
];

const values = [
  {
    icon: Leaf,
    title: "Des ingrédients d'exception",
    text: "Mozzarella fior di latte, tomates San Marzano, huile d'olive extra vierge : nous ne transigeons jamais sur la qualité.",
  },
  {
    icon: Flame,
    title: "La cuisson au feu de bois",
    text: "Notre four traditionnel monte à plus de 400°C pour une pâte croustillante à l'extérieur et moelleuse à cœur.",
  },
  {
    icon: Award,
    title: "Un savoir-faire artisanal",
    text: "Chaque pizza est étalée et garnie à la main par nos pizzaïolos, dans la plus pure tradition napolitaine.",
  },
  {
    icon: Clock,
    title: "Le goût du fait-maison",
    text: "Pâte pétrie et maturée sur place, sauces et desserts préparés chaque jour avec amour.",
  },
];

/** Page À propos : histoire, valeurs, savoir-faire. */
export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="Notre maison"
        title="À propos"
        subtitle="Une histoire de famille, de passion et de tradition italienne."
        image="/images/pizzeria/09_four_a_bois_pizza.png"
      />

      {/* Histoire */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <Image
              src="/images/pizzeria/10_pizzaiolo_preparation_pate.png"
              alt="Notre pizzaïolo travaillant la pâte"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionTitle
              eyebrow="Notre histoire"
              title={
                <>
                  Née d&apos;une <span className="text-gradient-warm">passion</span>{" "}
                  italienne
                </>
              }
              align="left"
            />
            <div className="mt-6 space-y-4 text-charcoal-800/80">
              <p>
                Tout a commencé avec une recette de famille transmise de
                génération en génération. En ouvrant La Bella, nous avons voulu
                partager le vrai goût de l&apos;Italie : celui des dimanches en
                famille, des produits du marché et du four à bois qui crépite.
              </p>
              <p>
                Aujourd&apos;hui encore, nous préparons notre pâte chaque matin
                et sélectionnons nos ingrédients auprès de producteurs passionnés.
                Parce qu&apos;une grande pizza, c&apos;est avant tout de grands
                produits et beaucoup de cœur.
              </p>
            </div>
            <CTAButton href="/notre-carte" className="mt-8">
              Découvrir notre carte
            </CTAButton>
          </Reveal>
        </div>
      </section>

      {/* Statistiques */}
      <section className="bg-charcoal-900 py-14 text-cream-50">
        <div className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <Reveal key={stat.label}>
              <p className="font-display text-4xl font-bold text-terracotta-400 lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm uppercase tracking-wide text-cream-200/70">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-page">
          <SectionTitle
            eyebrow="Ce qui nous anime"
            title="Notre philosophie"
            subtitle="Quatre engagements qui font la différence dans chaque pizza que nous servons."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                delay={i * 70}
                className="flex gap-5 rounded-2xl bg-white p-7 shadow-card"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta-500/12 text-terracotta-500">
                  <value.icon className="h-7 w-7" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-800/70">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
