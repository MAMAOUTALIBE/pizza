"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import { DELIVERY_MINIMUM } from "@/lib/orders";

/** Panier en panneau latéral (slide-over), ouvrable partout via useCart(). */
export function CartDrawer() {
  const { isOpen, closeCart, items, totalItems, subtotal, increment, decrement, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={cn("fixed inset-0 z-[70]", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {/* Voile */}
      <div
        className={cn("absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}
        onClick={closeCart}
      />

      {/* Panneau */}
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-100 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-cream-200 bg-white px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-charcoal-900">
            <ShoppingBag className="h-5 w-5 text-terracotta-500" aria-hidden />
            Votre panier
            {totalItems > 0 && <span className="text-sm font-medium text-charcoal-800/50">({totalItems})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-800/70 transition-colors hover:bg-cream-200 active:scale-95"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Liste */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-charcoal-800/20" aria-hidden />
            <p className="mt-4 text-charcoal-800/60">Votre panier est vide.</p>
            <Link
              href="/nos-pizzas"
              onClick={closeCart}
              className="mt-5 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
            >
              Voir les pizzas
            </Link>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-charcoal-900">{item.name}</p>
                  {item.options && item.options.length > 0 && (
                    <p className="truncate text-[0.7rem] text-charcoal-800/45">
                      {item.options.map((o) => o.label).join(" · ")}
                    </p>
                  )}
                  <p className="mt-0.5 text-sm font-bold text-terracotta-600">{formatPrice(item.price * item.quantity)}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <QtyBtn label="Retirer un" onClick={() => decrement(item.id)}><Minus className="h-3.5 w-3.5" /></QtyBtn>
                    <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                    <QtyBtn label="Ajouter un" onClick={() => increment(item.id)}><Plus className="h-3.5 w-3.5" /></QtyBtn>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label="Supprimer"
                      className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-charcoal-800/40 transition-colors hover:bg-tomato-500/10 hover:text-tomato-600 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pied : total + CTA */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-charcoal-800/60">Sous-total</span>
              <span className="text-lg font-bold text-charcoal-900">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/commander"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98]"
            >
              Valider ma commande
            </Link>
            <p className="mt-2 text-center text-[0.7rem] text-charcoal-800/45">
              Minimum {formatPrice(DELIVERY_MINIMUM)} pour la livraison.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function QtyBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-900/10 text-charcoal-800/70 transition-transform hover:border-terracotta-500/40 hover:text-terracotta-600 active:scale-90"
    >
      {children}
    </button>
  );
}
