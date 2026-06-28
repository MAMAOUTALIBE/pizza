import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * En-tête de section réutilisable : sur-titre rouge, titre fort,
 * petit séparateur feuille, et sous-titre optionnel.
 */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  const titleColor = tone === "dark" ? "text-charcoal-900" : "text-cream-50";
  const subColor = tone === "dark" ? "text-charcoal-800/70" : "text-cream-200/80";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={cn(
          "text-3xl font-bold uppercase sm:text-4xl lg:text-[2.75rem]",
          titleColor,
        )}
      >
        {title}
      </h2>
      <span
        className={cn(
          "block h-0.5 w-16 rounded-full bg-terracotta-500",
          align === "center" && "mx-auto",
        )}
        aria-hidden
      />
      {subtitle && (
        <p className={cn("max-w-2xl text-base leading-relaxed", subColor)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
