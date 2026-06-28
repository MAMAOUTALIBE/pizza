import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Logo textuel « La Bella / PIZZERIA » avec feuille de basilic en accent.
 * `tone` adapte les couleurs selon le fond (sombre = header, light = pages claires).
 */
export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string;
}) {
  const main = tone === "dark" ? "text-cream-50" : "text-charcoal-900";

  return (
    <Link
      href={href}
      aria-label="La Bella Pizzeria — accueil"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="relative leading-none">
        <span className={cn("font-script text-3xl sm:text-[2rem]", main)}>
          La Bella
        </span>
        <Leaf
          className="absolute -right-4 -top-1 h-4 w-4 rotate-12 text-basil-400 transition-transform duration-300 group-hover:rotate-45"
          aria-hidden
        />
      </span>
      <span className="mt-2 hidden text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-terracotta-500 sm:inline">
        Pizzeria
      </span>
    </Link>
  );
}
