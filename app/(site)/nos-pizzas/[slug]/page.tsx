import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { pizzas, getPizzaBySlug } from "@/data/pizzas";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";

export function generateStaticParams() {
  return pizzas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pizza = getPizzaBySlug(slug);
  if (!pizza) return { title: "Pizza introuvable" };
  return {
    title: `${pizza.name} — ${formatPrice(pizza.price)}`,
    description: pizza.description,
    openGraph: { images: [{ url: pizza.image }] },
  };
}

export default async function PizzaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pizza = getPizzaBySlug(slug);
  if (!pizza) notFound();

  return (
    <div className="bg-cream-100 pb-32 lg:pb-16">
      <div className="lg:container-page lg:grid lg:grid-cols-2 lg:gap-12 lg:pt-28">
        {/* Image */}
        <div className="relative aspect-square w-full lg:sticky lg:top-28 lg:h-fit lg:rounded-3xl lg:overflow-hidden lg:shadow-card">
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Retour */}
          <Link
            href="/nos-pizzas"
            aria-label="Retour aux pizzas"
            className="absolute left-4 top-24 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-950/55 text-cream-50 backdrop-blur transition-transform active:scale-90 lg:top-4"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          {pizza.badge && (
            <div className="absolute right-4 top-24 lg:top-4">
              <Badge tone={pizza.badge === "Signature" ? "premium" : "tomato"}>{pizza.badge}</Badge>
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="-mt-6 rounded-t-3xl bg-cream-100 px-5 pt-7 lg:mt-0 lg:rounded-none lg:px-0 lg:pt-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-charcoal-900 lg:text-4xl">
              {pizza.name}
            </h1>
            <span className="shrink-0 text-2xl font-bold text-terracotta-600 lg:text-3xl">
              {formatPrice(pizza.price)}
            </span>
          </div>

          <p className="mt-2 text-charcoal-800/70">{pizza.description}</p>

          {/* Tags */}
          {pizza.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pizza.tags.map((t) => (
                <span key={t} className="rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-medium text-charcoal-800/80">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Ingrédients */}
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-charcoal-900">Ingrédients</h2>
            <div className="flex flex-wrap gap-1.5">
              {pizza.ingredients.map((ing) => (
                <span key={ing} className="rounded-full border border-charcoal-900/10 bg-white px-3 py-1 text-xs text-charcoal-800/75">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <hr className="my-6 border-cream-200" />

          <ProductOrderPanel pizza={pizza} />
        </div>
      </div>
    </div>
  );
}
