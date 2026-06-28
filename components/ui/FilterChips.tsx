"use client";

import { cn } from "@/lib/utils";

export interface Chip {
  label: string;
  value: string;
}

/**
 * Rangée de chips de filtre défilable horizontalement (style app mobile).
 * Contrôlée : `active` + `onSelect`. Scroll horizontal sans scrollbar.
 */
export function FilterChips({
  items,
  active,
  onSelect,
  className,
}: {
  items: Chip[];
  active: string;
  onSelect: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0",
        className,
      )}
      role="tablist"
    >
      {items.map((chip) => {
        const isActive = chip.value === active;
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(chip.value)}
            className={cn(
              "inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-95",
              isActive
                ? "border-terracotta-500 bg-terracotta-500 text-white shadow-glow"
                : "border-charcoal-900/15 bg-white text-charcoal-800/80 hover:border-terracotta-500/50 hover:text-terracotta-600",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
