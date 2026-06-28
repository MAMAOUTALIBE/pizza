"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { Order } from "@/lib/admin/types";
import { formatMoney, formatDateTime } from "@/lib/admin/format";
import { paymentStatusStyles, paymentMethodLabels } from "@/lib/admin/status";
import { Card, StatusPill, EmptyState } from "@/components/admin/ui/kit";

export function PaymentsTable({ orders }: { orders: Order[] }) {
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (status && o.paymentStatus !== status) return false;
        if (method && o.paymentMethod !== method) return false;
        return true;
      }),
    [orders, status, method],
  );

  /** Export CSV côté client (téléchargement Blob). */
  function exportCsv() {
    const header = ["Commande", "Client", "Methode", "Statut", "Montant", "Date"];
    const rows = filtered.map((o) => [
      o.number,
      o.customerName,
      paymentMethodLabels[o.paymentMethod],
      paymentStatusStyles[o.paymentStatus].label,
      o.total.toFixed(2),
      formatDateTime(o.createdAt),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "paiements-labella.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none">
          <option value="">Tous les statuts</option>
          {Object.entries(paymentStatusStyles).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none">
          <option value="">Toutes les méthodes</option>
          {Object.entries(paymentMethodLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={exportCsv} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">Commande</th>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Méthode</th>
              <th className="px-4 py-2.5 font-semibold">Statut</th>
              <th className="px-4 py-2.5 text-right font-semibold">Montant</th>
              <th className="px-4 py-2.5 text-right font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 40).map((o) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">{o.number}</td>
                <td className="px-4 py-3 text-slate-600">{o.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{paymentMethodLabels[o.paymentMethod]}</td>
                <td className="px-4 py-3"><StatusPill {...paymentStatusStyles[o.paymentStatus]} /></td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(o.total)}</td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">{formatDateTime(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="Aucun paiement pour ces critères." />}
      </div>
    </Card>
  );
}
