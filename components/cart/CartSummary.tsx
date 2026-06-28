"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { CTAButtonAction } from "@/components/ui/CTAButton";
import { useCart } from "@/components/cart/CartProvider";
// Tarifs partagés avec le serveur (lib/orders) → pas de divergence client/serveur.
import { DELIVERY_FEE, DELIVERY_MINIMUM } from "@/lib/orders";

type OrderMode = "DELIVERY" | "PICKUP" | "DINE_IN";
type PaymentMethod = "ONLINE" | "ON_SITE";
type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface OrderResponse {
  data?: {
    orderNumber: string;
    total: number;
    etaMinutes: number;
  };
  error?: string;
}

const modes: Array<{ value: OrderMode; label: string }> = [
  { value: "DELIVERY", label: "Livraison" },
  { value: "PICKUP", label: "À emporter" },
  { value: "DINE_IN", label: "Sur place" },
];

const inputClass =
  "w-full rounded-xl border border-charcoal-900/15 bg-cream-50 px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-800/40 transition-colors focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30";

export function CartSummary({ className }: { className?: string }) {
  const { items, totalItems, subtotal, increment, decrement, remove, clear } = useCart();
  const [mode, setMode] = useState<OrderMode>("DELIVERY");
  const [payment, setPayment] = useState<PaymentMethod>("ONLINE");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const deliveryFee = mode === "DELIVERY" && subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const deliveryMinimumReached = mode !== "DELIVERY" || subtotal >= DELIVERY_MINIMUM;
  const canSubmit = items.length > 0 && deliveryMinimumReached && status !== "submitting";

  const payloadItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.pizzaId,
        quantity: item.quantity,
        options: item.options?.map((o) => ({ label: o.label })),
      })),
    [items],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!canSubmit) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    const formData = new FormData(form);
    const requestBody = JSON.stringify({
      channel: mode,
      customer: {
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        note: String(formData.get("note") ?? ""),
      },
      items: payloadItems,
    });

    try {
      if (payment === "ONLINE") {
        // Paiement carte → on récupère l'URL Stripe et on redirige.
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
        const result = (await response.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!response.ok || !result.url) {
          throw new Error(result.error || "Le paiement n'a pas pu démarrer.");
        }
        // Redirection vers Stripe Checkout (ou la confirmation en mode démo).
        window.location.href = result.url;
        return;
      }

      // Paiement sur place / à la livraison → création directe de la commande.
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      const result = (await response.json().catch(() => ({}))) as OrderResponse;
      if (!response.ok || !result.data) {
        throw new Error(result.error || "Impossible de créer la commande.");
      }
      setOrderNumber(result.data.orderNumber);
      setStatus("success");
      clear();
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de créer la commande.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <aside
        className={cn(
          "rounded-2xl border border-basil-500/25 bg-white p-6 shadow-card",
          className,
        )}
      >
        <CheckCircle2 className="h-11 w-11 text-basil-500" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-charcoal-900">
          Commande reçue
        </h2>
        <p className="mt-2 text-sm text-charcoal-800/70">
          Référence {orderNumber}. L&apos;équipe confirme la préparation au plus
          vite.
        </p>
        <CTAButtonAction
          type="button"
          size="md"
          className="mt-6 w-full"
          onClick={() => {
            setStatus("idle");
            setOrderNumber("");
          }}
        >
          Nouvelle commande
        </CTAButtonAction>
      </aside>
    );
  }

  return (
    <aside className={cn("rounded-2xl bg-white p-5 shadow-card", className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal-900">Votre commande</h2>
          <p className="text-sm text-charcoal-800/60">
            {totalItems} article{totalItems > 1 ? "s" : ""}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-500/12 text-terracotta-500">
          <ShoppingBag className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 rounded-xl bg-cream-100 p-1">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            aria-pressed={mode === item.value}
            className={cn(
              "rounded-lg px-2 py-2 text-xs font-semibold transition-colors",
              mode === item.value
                ? "bg-white text-terracotta-600 shadow-sm"
                : "text-charcoal-800/60 hover:text-charcoal-900",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-charcoal-900/15 p-6 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-charcoal-800/30" aria-hidden />
          <p className="mt-3 text-sm text-charcoal-800/60">
            Ajoutez une pizza pour commencer.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-cream-200">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-charcoal-900">
                  {item.name}
                </p>
                {item.options && item.options.length > 0 && (
                  <p className="truncate text-[0.7rem] text-charcoal-800/45">
                    {item.options.map((o) => o.label).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-charcoal-800/55">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label={`Retirer une ${item.name}`} onClick={() => decrement(item.id)}>
                  <Minus className="h-4 w-4" aria-hidden />
                </IconButton>
                <span className="w-6 text-center text-sm font-semibold text-charcoal-900">
                  {item.quantity}
                </span>
                <IconButton label={`Ajouter une ${item.name}`} onClick={() => increment(item.id)}>
                  <Plus className="h-4 w-4" aria-hidden />
                </IconButton>
                <IconButton label={`Supprimer ${item.name}`} onClick={() => remove(item.id)}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-2 border-t border-cream-200 pt-4 text-sm">
        <Line label="Sous-total" value={formatPrice(subtotal)} />
        <Line label="Livraison" value={deliveryFee ? formatPrice(deliveryFee) : "Offert"} />
        <div className="flex items-center justify-between pt-2 text-base font-bold text-charcoal-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {!deliveryMinimumReached && (
        <p className="mt-4 rounded-xl bg-tomato-500/10 px-4 py-3 text-sm text-tomato-600">
          Minimum livraison : {formatPrice(DELIVERY_MINIMUM)}.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {/* Choix du mode de paiement */}
        <div className="grid grid-cols-2 gap-2">
          <PaymentOption
            active={payment === "ONLINE"}
            onClick={() => setPayment("ONLINE")}
            icon={<CreditCard className="h-4 w-4" aria-hidden />}
            title="En ligne"
            subtitle="Carte bancaire"
          />
          <PaymentOption
            active={payment === "ON_SITE"}
            onClick={() => setPayment("ON_SITE")}
            icon={<Wallet className="h-4 w-4" aria-hidden />}
            title={mode === "DELIVERY" ? "À la livraison" : "Sur place"}
            subtitle="Espèces / CB"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <input
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Nom complet"
          />
          <input
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="Téléphone"
          />
        </div>
        <input
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          placeholder="Email"
        />
        {mode === "DELIVERY" && (
          <input
            name="address"
            required
            autoComplete="street-address"
            className={inputClass}
            placeholder="Adresse de livraison"
          />
        )}
        <textarea
          name="note"
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Note pour l'équipe"
        />

        {status === "error" && (
          <p className="rounded-xl bg-tomato-500/10 px-4 py-3 text-sm text-tomato-600">
            {errorMessage}
          </p>
        )}

        <CTAButtonAction
          type="submit"
          size="lg"
          className="w-full"
          disabled={!canSubmit}
        >
          {status === "submitting" ? (
            payment === "ONLINE" ? "Redirection vers le paiement…" : "Validation…"
          ) : payment === "ONLINE" ? (
            <>
              <CreditCard className="h-4 w-4" aria-hidden />
              Payer {formatPrice(total)}
            </>
          ) : (
            <>
              <Truck className="h-4 w-4" aria-hidden />
              Valider la commande
            </>
          )}
        </CTAButtonAction>

        <p className="text-center text-[0.7rem] text-charcoal-800/45">
          {payment === "ONLINE"
            ? "Paiement sécurisé par carte via Stripe."
            : "Vous réglez au moment de la livraison ou du retrait."}
        </p>
      </form>
    </aside>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-charcoal-900/10 text-charcoal-800/70 hover:border-terracotta-500/30 hover:text-terracotta-600"
    >
      {children}
    </button>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-terracotta-500 bg-terracotta-500/8 text-charcoal-900"
          : "border-charcoal-900/12 text-charcoal-800/70 hover:border-terracotta-500/40",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-terracotta-500 text-white" : "bg-cream-100 text-charcoal-800/60",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold leading-tight">{title}</span>
        <span className="block text-[0.65rem] leading-tight text-charcoal-800/50">{subtitle}</span>
      </span>
    </button>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-charcoal-800/70">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
