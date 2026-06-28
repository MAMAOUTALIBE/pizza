"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Pizza } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({ pizza }: { pizza: Pizza }) {
  const { addPizza } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Ajouter ${pizza.name} à la commande`}
      onClick={() => {
        addPizza(pizza);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1100);
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-terracotta-500/30 text-terracotta-500 transition-all duration-200 hover:bg-terracotta-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 data-[added=true]:bg-basil-500 data-[added=true]:text-white"
      data-added={added}
    >
      {added ? (
        <Check className="h-5 w-5" aria-hidden />
      ) : (
        <Plus className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
