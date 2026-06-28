"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/**
 * Conteneur qui révèle son contenu en fondu/translation à l'entrée dans
 * le viewport. `delay` (ms) permet d'échelonner une grille de cartes.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
