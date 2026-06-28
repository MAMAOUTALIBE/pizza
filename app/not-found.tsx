import Link from "next/link";
import { Pizza } from "lucide-react";

/** Page 404 globale (hors layout site). */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-6 text-center text-cream-50">
      <Pizza className="h-16 w-16 text-terracotta-400" aria-hidden />
      <p className="mt-6 font-script text-2xl text-terracotta-400">Oups…</p>
      <h1 className="mt-1 font-display text-6xl font-bold uppercase">404</h1>
      <p className="mt-3 max-w-sm text-cream-200/75">
        Cette page n&apos;existe pas (ou plus). Mais nos pizzas, elles, sont bien
        là&nbsp;!
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
