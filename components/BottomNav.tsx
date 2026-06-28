"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, Pizza } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

/**
 * Barre d'action fixe en bas d'écran (mobile/tablette uniquement).
 * Accueil · Carte · Commander (central, mis en avant) · Panier (ouvre le drawer).
 * Masquée sur desktop (lg:hidden).
 */
export function BottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal-900/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-center px-2">
        <Tab href="/" label="Accueil" active={isActive("/")} icon={<Home className="h-5 w-5" />} />
        <Tab href="/notre-carte" label="Carte" active={isActive("/notre-carte") || isActive("/nos-pizzas")} icon={<UtensilsCrossed className="h-5 w-5" />} />

        {/* Commander — central, surélevé */}
        <Link
          href="/commander"
          aria-label="Commander"
          className="flex flex-col items-center"
        >
          <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-glow ring-4 ring-cream-50 transition-transform active:scale-90">
            <Pizza className="h-6 w-6" aria-hidden />
          </span>
          <span className="mt-0.5 text-[0.65rem] font-semibold text-terracotta-600">Commander</span>
        </Link>

        {/* Panier — ouvre le drawer */}
        <button
          type="button"
          onClick={openCart}
          aria-label={`Panier (${totalItems} article${totalItems > 1 ? "s" : ""})`}
          className="flex flex-col items-center gap-0.5 text-charcoal-800/60 transition-colors active:scale-95"
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-tomato-600 px-1 text-[0.6rem] font-bold text-white">
                {totalItems}
              </span>
            )}
          </span>
          <span className="text-[0.65rem] font-medium">Panier</span>
        </button>
      </div>
    </nav>
  );
}

function Tab({ href, label, active, icon }: { href: string; label: string; active: boolean; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-0.5 transition-colors active:scale-95",
        active ? "text-terracotta-600" : "text-charcoal-800/60",
      )}
    >
      {icon}
      <span className="text-[0.65rem] font-medium">{label}</span>
    </Link>
  );
}
