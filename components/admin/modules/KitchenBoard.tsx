"use client";

import { useState } from "react";
import { Clock, ArrowRight, Check } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/admin/types";
import { formatTime } from "@/lib/admin/format";
import { channelStyles } from "@/lib/admin/status";
import { StatusPill } from "@/components/admin/ui/kit";
import { cn } from "@/lib/utils";

type KitchenStatus = "QUEUE" | "PREPARING" | "READY";

const columns: { key: KitchenStatus; title: string; ring: string }[] = [
  { key: "QUEUE", title: "À préparer", ring: "border-t-blue-400" },
  { key: "PREPARING", title: "En préparation", ring: "border-t-amber-400" },
  { key: "READY", title: "Prêtes", ring: "border-t-emerald-400" },
];

function mapStatus(s: OrderStatus): KitchenStatus {
  if (s === "PREPARING") return "PREPARING";
  if (s === "READY" || s === "OUT_FOR_DELIVERY" || s === "DELIVERED" || s === "PICKED_UP") return "READY";
  return "QUEUE";
}

/** Écran cuisine : colonnes par état, grosses cartes, déplacement rapide. */
export function KitchenBoard({ orders }: { orders: Order[] }) {
  const [board, setBoard] = useState<Record<string, KitchenStatus>>(() =>
    Object.fromEntries(orders.map((o) => [o.id, mapStatus(o.status)])),
  );

  const move = (id: string, to: KitchenStatus) =>
    setBoard((prev) => ({ ...prev, [id]: to }));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const items = orders.filter((o) => board[o.id] === col.key);
        return (
          <div key={col.key} className="rounded-2xl bg-slate-200/40 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">{col.title}</h2>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((o) => (
                <article
                  key={o.id}
                  className={cn("rounded-xl border-t-4 bg-white p-4 shadow-sm", col.ring)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{o.number}</span>
                    <StatusPill {...channelStyles[o.channel]} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" /> {formatTime(o.createdAt)} · ~{o.prepMinutes} min
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        <span className="font-semibold text-terracotta-600">{it.quantity}×</span> {it.name}
                        {it.options && it.options.length > 0 && (
                          <span className="block pl-5 text-xs text-slate-400">{it.options.join(" · ")}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {o.allergyNote && (
                    <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700">{o.allergyNote}</p>
                  )}

                  <div className="mt-3">
                    {col.key === "QUEUE" && (
                      <button onClick={() => move(o.id, "PREPARING")} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600">
                        Commencer <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    {col.key === "PREPARING" && (
                      <button onClick={() => move(o.id, "READY")} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                        Marquer prête <Check className="h-4 w-4" />
                      </button>
                    )}
                    {col.key === "READY" && (
                      <p className="text-center text-xs font-medium text-emerald-600">✓ Prête à servir / livrer</p>
                    )}
                  </div>
                </article>
              ))}
              {items.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-400">Aucune commande</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
