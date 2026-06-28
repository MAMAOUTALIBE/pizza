"use client";

import { useMemo, useState } from "react";
import { Star, Eye, EyeOff, Reply, Flag } from "lucide-react";
import type { Review, ReviewStatus } from "@/lib/admin/types";
import { formatRelative } from "@/lib/admin/format";
import { reviewStatusStyles } from "@/lib/admin/status";
import { Card, StatusPill, EmptyState } from "@/components/admin/ui/kit";
import { cn } from "@/lib/utils";

export function ReviewsModeration({ reviews }: { reviews: Review[] }) {
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>(
    () => Object.fromEntries(reviews.map((r) => [r.id, r.status])),
  );
  const [filter, setFilter] = useState("");

  const setStatus = (id: string, s: ReviewStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));

  const filtered = useMemo(
    () => reviews.filter((r) => !filter || statuses[r.id] === filter),
    [reviews, filter, statuses],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {[["", "Tous"], ["PENDING", "À modérer"], ["PUBLISHED", "Publiés"], ["HIDDEN", "Masqués"], ["FLAGGED", "Signalés"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === v ? "bg-terracotta-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((r) => {
          const status = statuses[r.id];
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{r.authorName}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                    ))}
                    {r.productName && <span className="ml-1 text-xs text-slate-400">· {r.productName}</span>}
                  </div>
                </div>
                <StatusPill {...reviewStatusStyles[status]} />
              </div>

              <p className="mt-3 text-sm text-slate-600">“{r.comment}”</p>
              <p className="mt-1 text-xs text-slate-400">{formatRelative(r.createdAt)}</p>

              {r.reply && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Réponse :</span> {r.reply}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {status !== "PUBLISHED" && (
                  <button onClick={() => setStatus(r.id, "PUBLISHED")} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                    <Eye className="h-3.5 w-3.5" /> Publier
                  </button>
                )}
                {status !== "HIDDEN" && (
                  <button onClick={() => setStatus(r.id, "HIDDEN")} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    <EyeOff className="h-3.5 w-3.5" /> Masquer
                  </button>
                )}
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                  <Reply className="h-3.5 w-3.5" /> Répondre
                </button>
                <button onClick={() => setStatus(r.id, "FLAGGED")} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                  <Flag className="h-3.5 w-3.5" /> Signaler
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && <EmptyState message="Aucun avis pour ce filtre." />}
    </>
  );
}
