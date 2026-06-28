"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import type { Order } from "@/lib/admin/types";
import { formatMoney, formatRelative } from "@/lib/admin/format";
import { orderStatusStyles, channelStyles, paymentStatusStyles } from "@/lib/admin/status";
import { StatusPill, Card, EmptyState } from "@/components/admin/ui/kit";

const STATUS_OPTIONS = [
  ["", "Tous les statuts"],
  ["NEW", "Nouvelle"],
  ["CONFIRMED", "Confirmée"],
  ["PREPARING", "En préparation"],
  ["READY", "Prête"],
  ["OUT_FOR_DELIVERY", "En livraison"],
  ["DELIVERED", "Livrée"],
  ["CANCELLED", "Annulée"],
] as const;

const CHANNEL_OPTIONS = [
  ["", "Tous les canaux"],
  ["DELIVERY", "Livraison"],
  ["PICKUP", "À emporter"],
  ["DINE_IN", "Sur place"],
  ["QR_TABLE", "QR à table"],
] as const;

/** Tableau des commandes avec recherche et filtres (statut, canal). */
export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status && o.status !== status) return false;
      if (channel && o.channel !== channel) return false;
      if (q && !`${o.number} ${o.customerName} ${o.customerPhone}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, query, status, channel]);

  return (
    <Card padded={false}>
      {/* Filtres */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (n°, client, téléphone)…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none"
        >
          {CHANNEL_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <p className="px-4 py-2 text-xs text-slate-400">{filtered.length} commande(s)</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">N°</th>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Canal</th>
              <th className="px-4 py-2.5 font-semibold">Statut</th>
              <th className="px-4 py-2.5 font-semibold">Paiement</th>
              <th className="px-4 py-2.5 text-right font-semibold">Total</th>
              <th className="px-4 py-2.5 text-right font-semibold">Quand</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">{o.number}</td>
                <td className="px-4 py-3">
                  <span className="block text-slate-700">{o.customerName}</span>
                  <span className="block text-xs text-slate-400">{o.customerPhone}</span>
                </td>
                <td className="px-4 py-3"><StatusPill {...channelStyles[o.channel]} /></td>
                <td className="px-4 py-3"><StatusPill {...orderStatusStyles[o.status]} /></td>
                <td className="px-4 py-3"><StatusPill {...paymentStatusStyles[o.paymentStatus]} /></td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(o.total)}</td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">{formatRelative(o.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/commandes/${o.id}`}
                    className="inline-flex items-center gap-1 text-terracotta-600 hover:underline"
                    aria-label={`Voir ${o.number}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="Aucune commande ne correspond à ces critères." />}
      </div>
    </Card>
  );
}
