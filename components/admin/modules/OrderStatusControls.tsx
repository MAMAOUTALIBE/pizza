"use client";

import { useState, useTransition } from "react";
import { Printer, Ban, RefreshCw, Loader2 } from "lucide-react";
import type { OrderStatus } from "@/lib/admin/types";
import { orderStatusStyles } from "@/lib/admin/status";
import { StatusPill } from "@/components/admin/ui/kit";
import { updateOrderStatus } from "@/app/admin/(dashboard)/commandes/[id]/actions";
import { cn } from "@/lib/utils";

const FLOW: OrderStatus[] = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

/**
 * Contrôles de statut d'une commande.
 * Chaque action appelle la server action `updateOrderStatus` : persistée en base
 * + journalisée quand la persistance est active, sinon état optimiste (démo).
 */
export function OrderStatusControls({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const currentIndex = FLOW.indexOf(status);

  function change(next: OrderStatus) {
    if (next === status || pending) return;
    const previous = status;
    setStatus(next); // optimiste
    setError("");
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, next);
      if (!res.ok) {
        setStatus(previous); // revert
        setError(res.error ?? "Échec de la mise à jour.");
      }
    });
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-slate-500">Statut actuel :</span>
        <StatusPill {...orderStatusStyles[status]} />
        {pending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-label="Enregistrement" />}
      </div>

      {/* Étapes cliquables */}
      <div className="flex flex-wrap gap-1.5">
        {FLOW.map((s, i) => {
          const reached = i <= currentIndex && currentIndex >= 0;
          return (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => change(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                reached ? "bg-terracotta-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              )}
            >
              {orderStatusStyles[s].label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" /> Imprimer le ticket
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => change("REFUNDED")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className="h-4 w-4" /> Rembourser
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => change("CANCELLED")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          <Ban className="h-4 w-4" /> Annuler
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-tomato-600">{error}</p>}
    </div>
  );
}
