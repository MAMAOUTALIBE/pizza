"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Vide le panier au montage (après un paiement réussi).
 * Rendu invisible — à placer sur la page de confirmation.
 */
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // On ne vide qu'une fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
