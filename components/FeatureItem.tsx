import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pilier de réassurance (icône + titre + description).
 * `layout` : "row" pour la hero (icône au-dessus), "stack" pour la section qualité.
 */
export function FeatureItem({
  icon: Icon,
  title,
  description,
  tone = "dark",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const titleColor = tone === "dark" ? "text-cream-50" : "text-charcoal-900";
  const descColor = tone === "dark" ? "text-cream-200/70" : "text-charcoal-800/65";

  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-terracotta-500/40 bg-terracotta-500/10 text-terracotta-400">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className={cn("text-sm font-semibold uppercase tracking-wide", titleColor)}>
        {title}
      </h3>
      {description && <p className={cn("text-xs", descColor)}>{description}</p>}
    </div>
  );
}
