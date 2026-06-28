import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Affichage d'une note sur 5 sous forme d'étoiles. */
export function Rating({
  value,
  className,
  size = 16,
}: {
  value: number;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Note : ${value} sur 5`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={
            i < Math.round(value)
              ? "fill-terracotta-400 text-terracotta-400"
              : "text-charcoal-800/25"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}
