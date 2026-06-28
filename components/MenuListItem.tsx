import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

/** Ligne de produit (boisson, dessert, accompagnement) façon carte de restaurant. */
export function MenuListItem({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-baseline gap-3 py-3">
      <div className="min-w-0">
        <h3 className="font-semibold text-charcoal-900">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 text-sm text-charcoal-800/65">{item.description}</p>
        )}
      </div>
      {/* Pointillés de liaison */}
      <span
        className="mb-1 h-px flex-1 translate-y-1 border-b border-dashed border-charcoal-900/20"
        aria-hidden
      />
      <span className="shrink-0 font-bold text-terracotta-600">
        {formatPrice(item.price)}
      </span>
    </div>
  );
}
