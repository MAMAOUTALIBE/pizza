import { Database, FlaskConical } from "lucide-react";

/**
 * Indique si les données affichées proviennent de la base (persistance active)
 * ou des données de démonstration (mock).
 */
export function DataSourceBadge({ live }: { live: boolean }) {
  if (live) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
        <Database className="h-3.5 w-3.5" aria-hidden />
        Données en base
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
      Données démo
    </span>
  );
}
