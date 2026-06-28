import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta-500 text-white shadow-glow hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-cream-50 text-charcoal-900 hover:bg-white hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-cream-50/40 text-cream-50 hover:border-cream-50 hover:bg-cream-50/10",
  ghost: "text-charcoal-900 hover:bg-charcoal-900/5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm sm:text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Bouton CTA en tant que lien (cas le plus courant). */
export function CTAButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/** Variante <button> pour les actions (formulaires, ouverture de modales…). */
export function CTAButtonAction({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
