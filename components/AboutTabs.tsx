"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Hand, Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "+15", label: "Ans de passion" },
  { value: "100%", label: "Pâte maison" },
  { value: "+50", label: "Recettes" },
  { value: "4,8/5", label: "Satisfaction" },
];

const values = [
  { icon: Leaf, title: "Produits frais", text: "Sélectionnés chaque jour" },
  { icon: Hand, title: "Pâte maison", text: "Préparée sur place" },
  { icon: Flame, title: "Feu de bois", text: "Goût authentique" },
  { icon: Heart, title: "Fait avec amour", text: "Votre satisfaction d'abord" },
];

const tabs = ["Histoire", "Valeurs", "Chiffres"] as const;

/** Page À propos condensée en une vue, avec onglets (mobile/tablette). */
export function AboutTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Histoire");

  return (
    <section className="bg-paper py-8 lg:hidden">
      <div className="container-page max-w-xl md:max-w-2xl">
        {/* Onglets */}
        <div role="tablist" className="mb-5 grid grid-cols-3 gap-1 rounded-full bg-cream-200 p-1">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full py-2 text-sm font-semibold transition-colors active:scale-95",
                tab === t ? "bg-white text-terracotta-600 shadow-sm" : "text-charcoal-800/60",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div key={tab} className="animate-fade-up-sm">
        {tab === "Histoire" && (
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-card">
              <Image src="/images/pizzeria/10_pizzaiolo_preparation_pate.png" alt="Notre pizzaïolo" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-800/80">
              Une recette de famille transmise de génération en génération. Pâte
              pétrie chaque matin, ingrédients de producteurs passionnés et cuisson
              au feu de bois : le vrai goût de l&apos;Italie.
            </p>
            <Link href="/notre-carte" className="mt-4 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white active:scale-95">
              Découvrir la carte
            </Link>
          </div>
        )}

        {tab === "Valeurs" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-4 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-500/12 text-terracotta-500">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-2.5 text-sm font-semibold text-charcoal-900">{v.title}</h3>
                <p className="text-xs text-charcoal-800/60">{v.text}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Chiffres" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-charcoal-900 p-5 text-center text-cream-50">
                <p className="font-display text-3xl font-bold text-terracotta-400">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-cream-200/70">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
