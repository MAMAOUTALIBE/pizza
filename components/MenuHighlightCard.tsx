import Image from "next/image";
import { Check } from "lucide-react";
import type { Formula } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";

/** Carte de formule / menu (page Menus). */
export function MenuHighlightCard({
  formula,
  className,
}: {
  formula: Formula;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover",
        formula.popular && "ring-2 ring-terracotta-500",
        className,
      )}
    >
      {formula.popular && (
        <div className="absolute right-4 top-4 z-10">
          <Badge tone="terracotta">Populaire</Badge>
        </div>
      )}

      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={formula.image}
          alt={formula.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal-900">
          {formula.name}
        </h3>
        <p className="mt-2 text-sm text-charcoal-800/70">{formula.description}</p>

        <ul className="mt-4 flex-1 space-y-2">
          {formula.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-charcoal-800/85"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-basil-500"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {formula.availability && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-charcoal-800/50">
            {formula.availability}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-5">
          <div className="leading-none">
            <span className="block text-[0.65rem] uppercase tracking-wider text-charcoal-800/50">
              {formula.badge ?? "Prix"}
            </span>
            <span className="text-2xl font-bold text-terracotta-600">
              {formatPrice(formula.price)}
            </span>
          </div>
          <CTAButton href="/commander" size="sm">
            Commander
          </CTAButton>
        </div>
      </div>
    </article>
  );
}
