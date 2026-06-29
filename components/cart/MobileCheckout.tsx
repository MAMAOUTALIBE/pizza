"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Truck, ShoppingBag, Store, CreditCard, Wallet, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { DELIVERY_FEE, DELIVERY_MINIMUM } from "@/lib/orders";
import { formatPrice, cn } from "@/lib/utils";

type Mode = "DELIVERY" | "PICKUP" | "DINE_IN";
type Payment = "ONLINE" | "ON_SITE";
type Status = "idle" | "submitting" | "success" | "error";

const modes: Array<{ value: Mode; label: string; icon: typeof Truck; hint: string }> = [
  { value: "DELIVERY", label: "Livraison", icon: Truck, hint: "Chez vous en ~30 min" },
  { value: "PICKUP", label: "À emporter", icon: ShoppingBag, hint: "À récupérer sur place" },
  { value: "DINE_IN", label: "Sur place", icon: Store, hint: "À déguster au resto" },
];

const input =
  "w-full rounded-xl border border-charcoal-900/15 bg-cream-50 px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-800/40 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/25";

/** Tunnel de commande mobile en 3 étapes compactes (1 vue par étape). */
export function MobileCheckout() {
  const { items, totalItems, subtotal, clear } = useCart();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode>("DELIVERY");
  const [payment, setPayment] = useState<Payment>("ONLINE");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const deliveryFee = mode === "DELIVERY" && subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const minReached = mode !== "DELIVERY" || subtotal >= DELIVERY_MINIMUM;
  const infoValid = form.name.trim() && form.phone.trim() && (mode !== "DELIVERY" || form.address.trim());

  const payloadItems = useMemo(
    () => items.map((i) => ({ id: i.pizzaId, quantity: i.quantity, options: i.options?.map((o) => ({ label: o.label })) })),
    [items],
  );

  async function submit() {
    setStatus("submitting");
    setError("");
    const body = JSON.stringify({ channel: mode, customer: form, items: payloadItems });
    try {
      if (payment === "ONLINE") {
        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body });
        const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || "Le paiement n'a pas pu démarrer.");
        window.location.href = data.url;
        return;
      }
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const data = (await res.json().catch(() => ({}))) as { data?: { orderNumber: string }; error?: string };
      if (!res.ok || !data.data) throw new Error(data.error || "Impossible de créer la commande.");
      setOrderNumber(data.data.orderNumber);
      setStatus("success");
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setStatus("error");
    }
  }

  // --- Panier vide ---
  if (items.length === 0 && status !== "success") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <ShoppingBag className="mx-auto h-12 w-12 text-charcoal-800/20" aria-hidden />
        <p className="mt-4 text-charcoal-800/60">Votre panier est vide.</p>
        <Link href="/nos-pizzas" className="mt-5 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white active:scale-95">
          Voir les pizzas
        </Link>
      </div>
    );
  }

  // --- Confirmation (paiement sur place) ---
  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-14 w-14 text-basil-500" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-bold uppercase text-charcoal-900">Commande reçue&nbsp;!</h2>
        <p className="mt-2 text-sm text-charcoal-800/70">Référence {orderNumber}. À régler à la remise.</p>
        <Link href="/nos-pizzas" className="mt-6 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white active:scale-95">
          Nouvelle commande
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      {/* Progression */}
      <div className="flex items-center gap-2 border-b border-cream-200 px-5 py-4">
        {["Mode", "Infos", "Paiement"].map((label, i) => {
          const n = i + 1;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", n <= step ? "bg-terracotta-500 text-white" : "bg-cream-200 text-charcoal-800/50")}>{n}</span>
              <span className={cn("text-xs font-medium", n === step ? "text-charcoal-900" : "text-charcoal-800/45")}>{label}</span>
            </div>
          );
        })}
      </div>

      <div key={step} className="animate-fade-up-sm p-5">
        {/* ÉTAPE 1 — Mode */}
        {step === 1 && (
          <div className="space-y-3">
            {modes.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={cn("flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]", mode === m.value ? "border-terracotta-500 bg-terracotta-500/8" : "border-charcoal-900/12")}
              >
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", mode === m.value ? "bg-terracotta-500 text-white" : "bg-cream-100 text-terracotta-500")}>
                  <m.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-charcoal-900">{m.label}</span>
                  <span className="block text-xs text-charcoal-800/55">{m.hint}</span>
                </span>
                {mode === m.value && <CheckCircle2 className="h-5 w-5 text-terracotta-500" aria-hidden />}
              </button>
            ))}
            {!minReached && (
              <p className="rounded-xl bg-tomato-500/10 px-4 py-2.5 text-sm text-tomato-600">
                Minimum {formatPrice(DELIVERY_MINIMUM)} pour la livraison.
              </p>
            )}
            <button
              type="button"
              disabled={!minReached}
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-terracotta-500 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ÉTAPE 2 — Infos */}
        {step === 2 && (
          <div className="space-y-3">
            <input className={input} placeholder="Nom complet" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} placeholder="Téléphone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className={input} placeholder="Email (facultatif)" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {mode === "DELIVERY" && (
              <input className={input} placeholder="Adresse de livraison" autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            )}
            <input className={input} placeholder="Note pour l'équipe (facultatif)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-1 rounded-full border border-charcoal-900/15 px-5 py-3.5 text-sm font-semibold text-charcoal-800/80 active:scale-95">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>
              <button type="button" disabled={!infoValid} onClick={() => setStep(3)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-terracotta-500 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] disabled:opacity-50">
                Continuer <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Paiement + récap */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <PayBtn active={payment === "ONLINE"} onClick={() => setPayment("ONLINE")} icon={<CreditCard className="h-4 w-4" />} title="En ligne" sub="Carte bancaire" />
              <PayBtn active={payment === "ON_SITE"} onClick={() => setPayment("ON_SITE")} icon={<Wallet className="h-4 w-4" />} title={mode === "DELIVERY" ? "À la livraison" : "Sur place"} sub="Espèces / CB" />
            </div>

            <div className="space-y-1.5 rounded-2xl bg-cream-100 p-4 text-sm">
              <Row label={`Sous-total (${totalItems})`} value={formatPrice(subtotal)} />
              <Row label="Livraison" value={deliveryFee ? formatPrice(deliveryFee) : "Offert"} />
              <div className="flex justify-between border-t border-cream-200 pt-1.5 text-base font-bold text-charcoal-900">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            {status === "error" && <p className="rounded-xl bg-tomato-500/10 px-4 py-2.5 text-sm text-tomato-600">{error}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="flex items-center justify-center gap-1 rounded-full border border-charcoal-900/15 px-5 py-3.5 text-sm font-semibold text-charcoal-800/80 active:scale-95">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>
              <button type="button" disabled={status === "submitting"} onClick={submit} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-terracotta-500 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60">
                {status === "submitting" ? "…" : payment === "ONLINE" ? `Payer ${formatPrice(total)}` : `Valider ${formatPrice(total)}`}
              </button>
            </div>
            <p className="text-center text-[0.7rem] text-charcoal-800/45">
              {payment === "ONLINE" ? "Paiement sécurisé par Stripe." : "Réglez à la livraison ou au retrait."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PayBtn({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors active:scale-95", active ? "border-terracotta-500 bg-terracotta-500/8" : "border-charcoal-900/12")}>
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", active ? "bg-terracotta-500 text-white" : "bg-cream-100 text-charcoal-800/60")}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold leading-tight text-charcoal-900">{title}</span>
        <span className="block text-[0.65rem] leading-tight text-charcoal-800/50">{sub}</span>
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-charcoal-800/70">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
