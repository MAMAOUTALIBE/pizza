"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Star, Pencil } from "lucide-react";
import type { Product } from "@/lib/admin/types";
import { formatMoney } from "@/lib/admin/format";
import { Card, EmptyState } from "@/components/admin/ui/kit";
import { cn } from "@/lib/utils";

/** Interrupteur de disponibilité (état local de démo). */
function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-emerald-500" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    () => Object.fromEntries(products.map((p) => [p.id, p.available])),
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, category]);

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-terracotta-500 focus:outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">Produit</th>
              <th className="px-4 py-2.5 font-semibold">Catégorie</th>
              <th className="px-4 py-2.5 text-right font-semibold">Prix</th>
              <th className="px-4 py-2.5 text-right font-semibold">Vendus</th>
              <th className="px-4 py-2.5 text-center font-semibold">Disponible</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {p.image && (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                      )}
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-900">
                        {p.name}
                        {p.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      </span>
                      {p.badges.length > 0 && (
                        <span className="text-xs text-slate-400">{p.badges.join(" · ")}</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(p.price)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{p.soldCount}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Toggle
                      on={availability[p.id]}
                      onChange={() => setAvailability((a) => ({ ...a, [p.id]: !a[p.id] }))}
                      label={`Disponibilité de ${p.name}`}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-slate-500 hover:text-terracotta-600" aria-label={`Modifier ${p.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="Aucun produit trouvé." />}
      </div>
    </Card>
  );
}
