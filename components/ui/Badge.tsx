import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "terracotta" | "tomato" | "basil" | "neutral" | "premium";

const tones: Record<Tone, string> = {
  terracotta: "bg-terracotta-500 text-white",
  tomato: "bg-tomato-600 text-white",
  basil: "bg-basil-500 text-white",
  premium: "bg-charcoal-900 text-cream-50 ring-1 ring-terracotta-500/40",
  neutral: "bg-cream-200 text-charcoal-800",
};

/** Petit badge / pastille (badge produit, tag, statut). */
export function Badge({
  children,
  tone = "terracotta",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
