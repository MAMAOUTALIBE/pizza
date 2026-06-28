"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Pizza } from "@/lib/types";
import { MAX_ITEM_QTY } from "@/lib/orders";

const STORAGE_KEY = "labella-cart";

export interface CartOption {
  label: string;
  priceDelta: number;
}

export interface CartItem {
  /** Identifiant de ligne (composite si options) — clé d'agrégation panier. */
  id: string;
  /** Identifiant catalogue réel (envoyé au serveur pour re-tarification). */
  pizzaId: string;
  name: string;
  price: number; // prix unitaire (base + options)
  image: string;
  quantity: number;
  options?: CartOption[];
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addPizza: (pizza: Pizza) => void;
  addConfigured: (line: Omit<CartItem, "quantity">, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item &&
                typeof item.id === "string" &&
                typeof item.price === "number" &&
                typeof item.quantity === "number" &&
                item.quantity > 0,
            ).map((item) => ({ ...item, pizzaId: item.pizzaId ?? item.id })),
          );
        }
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const updateQuantity = (id: string, delta: number) => {
      setItems((current) =>
        current
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_ITEM_QTY, Math.max(0, item.quantity + delta)) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    };

    const addLine = (line: Omit<CartItem, "quantity">, quantity: number) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === line.id);
        if (existing) {
          return current.map((item) =>
            item.id === line.id ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [...current, { ...line, quantity }];
      });
    };

    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addPizza: (pizza) =>
        addLine(
          { id: pizza.id, pizzaId: pizza.id, name: pizza.name, price: pizza.price, image: pizza.image },
          1,
        ),
      addConfigured: (line, quantity) => addLine(line, quantity),
      increment: (id) => updateQuantity(id, 1),
      decrement: (id) => updateQuantity(id, -1),
      remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
