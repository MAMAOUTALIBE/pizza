"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import type { Pizza } from "@/lib/types";
import { PIZZA_SIZES, PIZZA_SUPPLEMENTS } from "@/lib/orders";
import { useCart, type CartOption } from "@/components/cart/CartProvider";
import { formatPrice, cn } from "@/lib/utils";

/** Panneau de commande d'une pizza : taille, suppléments, quantité, ajout panier. */
export function ProductOrderPanel({ pizza }: { pizza: Pizza }) {
  const { addConfigured, openCart } = useCart();
  const [size, setSize] = useState<string>("Normale");
  const [supps, setSupps] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const toggleSupp = (label: string) =>
    setSupps((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

  const options: CartOption[] = useMemo(() => {
    const list: CartOption[] = [];
    // « Normale » est la taille par défaut (delta 0) → on ne l'ajoute pas comme
    // option, pour qu'une pizza sans personnalisation fusionne avec l'ajout rapide.
    if (size !== "Normale") {
      const sizeDelta = PIZZA_SIZES.find((o) => o.label === size)?.priceDelta ?? 0;
      list.push({ label: size, priceDelta: sizeDelta });
    }
    for (const label of supps) {
      const d = PIZZA_SUPPLEMENTS.find((o) => o.label === label)?.priceDelta ?? 0;
      list.push({ label, priceDelta: d });
    }
    return list;
  }, [size, supps]);

  const unitPrice = useMemo(
    () => Math.max(0, Math.round((pizza.price + options.reduce((s, o) => s + o.priceDelta, 0)) * 100) / 100),
    [pizza.price, options],
  );
  const total = Math.round(unitPrice * qty * 100) / 100;

  function add() {
    // Clé canonique : si aucune option, on retombe sur l'id catalogue afin de
    // fusionner avec l'ajout rapide (« + ») de la même pizza.
    const id = options.length === 0 ? pizza.id : `${pizza.id}|${size}|${[...supps].sort().join(",")}`;
    addConfigured(
      { id, pizzaId: pizza.id, name: pizza.name, price: unitPrice, image: pizza.image, options },
      qty,
    );
    openCart();
  }

  return (
    <div className="space-y-7">
      {/* Taille */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-charcoal-900">Taille</h2>
        <div className="grid grid-cols-3 gap-2">
          {PIZZA_SIZES.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setSize(o.label)}
              aria-pressed={size === o.label}
              className={cn(
                "rounded-2xl border px-3 py-3 text-center transition-all active:scale-95",
                size === o.label
                  ? "border-terracotta-500 bg-terracotta-500/8"
                  : "border-charcoal-900/12 hover:border-terracotta-500/40",
              )}
            >
              <span className="block text-sm font-semibold text-charcoal-900">{o.label}</span>
              <span className="block text-xs text-charcoal-800/55">
                {o.priceDelta === 0 ? "Incluse" : `${o.priceDelta > 0 ? "+" : ""}${formatPrice(o.priceDelta)}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suppléments */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-charcoal-900">Suppléments</h2>
        <div className="flex flex-wrap gap-2">
          {PIZZA_SUPPLEMENTS.map((o) => {
            const on = supps.includes(o.label);
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => toggleSupp(o.label)}
                aria-pressed={on}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all active:scale-95",
                  on
                    ? "border-terracotta-500 bg-terracotta-500 text-white"
                    : "border-charcoal-900/15 text-charcoal-800/80 hover:border-terracotta-500/40",
                )}
              >
                {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                {o.label}
                <span className={on ? "text-white/80" : "text-charcoal-800/50"}>+{formatPrice(o.priceDelta)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantité */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-900">Quantité</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Diminuer"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-900/15 text-charcoal-800/70 transition-transform hover:border-terracotta-500/40 active:scale-90"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-lg font-bold text-charcoal-900">{qty}</span>
          <button
            type="button"
            aria-label="Augmenter"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-900/15 text-charcoal-800/70 transition-transform hover:border-terracotta-500/40 active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Ajouter — inline (desktop) */}
      <button
        type="button"
        onClick={add}
        className="hidden w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 py-4 text-base font-semibold text-white shadow-glow transition-transform hover:bg-terracotta-600 active:scale-[0.98] lg:flex"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        Ajouter au panier — {formatPrice(total)}
      </button>

      {/* Ajouter — barre sticky (mobile, au-dessus de la nav basse) */}
      <div className="fixed inset-x-0 bottom-[calc(4rem_+_env(safe-area-inset-bottom))] z-30 border-t border-charcoal-900/10 bg-cream-50/95 p-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 py-3.5 text-base font-semibold text-white shadow-glow transition-transform active:scale-[0.98]"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Ajouter — {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
