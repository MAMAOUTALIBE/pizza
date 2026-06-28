import Image from "next/image";
import Link from "next/link";
import type { Pizza } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/**
 * Carte produit pizza : image cliquable (→ détail), nom, description, prix et
 * bouton d'ajout rapide. Compacte sur mobile (grille 2 colonnes).
 */
export function PizzaCard({
  pizza,
  showTags = false,
  className,
}: {
  pizza: Pizza;
  showTags?: boolean;
  className?: string;
}) {
  const href = `/nos-pizzas/${pizza.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" aria-label={pizza.name}>
        <Image
          src={pizza.image}
          alt={`Pizza ${pizza.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {pizza.badge && (
          <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
            <Badge tone={pizza.badge === "Signature" ? "premium" : "tomato"}>{pizza.badge}</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Link href={href}>
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-charcoal-900 sm:text-xl">
            {pizza.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 flex-1 text-xs leading-relaxed text-charcoal-800/70 sm:mt-2 sm:line-clamp-2 sm:text-sm">
          {pizza.description}
        </p>

        {showTags && pizza.tags.length > 0 && (
          <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
            {pizza.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-charcoal-800/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between sm:mt-4">
          <span className="text-base font-bold text-terracotta-600 sm:text-lg">
            {formatPrice(pizza.price)}
          </span>
          <AddToCartButton pizza={pizza} />
        </div>
      </div>
    </article>
  );
}
