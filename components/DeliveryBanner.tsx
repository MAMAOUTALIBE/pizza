import Image from "next/image";
import { Bike } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { cn } from "@/lib/utils";

/**
 * Bannière promotionnelle livraison (vert basilic) avec visuel livreur.
 * Réutilisée sur l'accueil et la page Contact.
 */
export function DeliveryBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-basil-600 p-8 text-cream-50 shadow-card",
        className,
      )}
    >
      {/* Visuel livreur en fond */}
      <Image
        src="/images/pizzeria/08_livraison_scooter_ambiance_italienne.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover opacity-25"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-basil-600 via-basil-600/85 to-basil-600/30" aria-hidden />

      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50/15">
          <Bike className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-3xl font-bold uppercase tracking-tight">
          Livraison rapide
        </h3>
        <p className="mt-2 max-w-xs text-cream-50/90">
          À domicile ou au bureau, 7j/7 de 11h à 23h. Chaude et savoureuse,
          en moins de 30 minutes.
        </p>
      </div>

      <div className="relative mt-6">
        <CTAButton href="/commander" size="lg" variant="secondary">
          Commander maintenant
        </CTAButton>
      </div>
    </div>
  );
}
