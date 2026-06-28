"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import type { Customer } from "@/lib/admin/types";
import { formatMoney, formatRelative } from "@/lib/admin/format";
import { Card, EmptyState } from "@/components/admin/ui/kit";

const tagColor = (tag: string) => {
  if (tag === "VIP") return "bg-purple-100 text-purple-700";
  if (tag === "Client fidèle") return "bg-emerald-100 text-emerald-700";
  if (tag === "Nouveau client") return "bg-blue-100 text-blue-700";
  if (tag === "Inactif") return "bg-slate-200 text-slate-600";
  return "bg-amber-100 text-amber-700";
};

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  const tags = useMemo(
    () => Array.from(new Set(customers.flatMap((c) => c.tags))).sort(),
    [customers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers
      .filter((c) => {
        if (tag && !c.tags.includes(tag)) return false;
        if (q && !`${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, query, tag]);

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
          />
        </div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none"
        >
          <option value="">Tous les segments</option>
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <p className="px-4 py-2 text-xs text-slate-400">{filtered.length} client(s)</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Segments</th>
              <th className="px-4 py-2.5 text-right font-semibold">Cmd.</th>
              <th className="px-4 py-2.5 text-right font-semibold">Total</th>
              <th className="px-4 py-2.5 text-right font-semibold">Panier moy.</th>
              <th className="px-4 py-2.5 text-right font-semibold">Dern. cmd</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <span className="block font-medium text-slate-900">{c.firstName} {c.lastName}</span>
                  <span className="block text-xs text-slate-400">{c.email}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 2).map((t) => (
                      <span key={t} className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${tagColor(t)}`}>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{c.ordersCount}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(c.totalSpent)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(c.avgBasket)}</td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">{c.lastOrderAt ? formatRelative(c.lastOrderAt) : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/clients/${c.id}`} className="inline-flex text-terracotta-600 hover:underline" aria-label={`Voir ${c.firstName}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="Aucun client trouvé." />}
      </div>
    </Card>
  );
}
