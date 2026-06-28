import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ShieldAlert className="mx-auto h-12 w-12 text-tomato-500" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-slate-900">Accès refusé</h2>
      <p className="mt-2 text-sm text-slate-500">
        Votre rôle ne dispose pas des permissions nécessaires pour accéder à
        cette section.
      </p>
      {params?.from && (
        <p className="mt-3 break-all rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
          Section demandée : {params.from}
        </p>
      )}
      <Link
        href="/admin"
        className="mt-6 inline-block rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}
