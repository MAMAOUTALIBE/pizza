import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Leaf } from "lucide-react";
import { getSession, isDemoVisible } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Back-office",
  robots: { index: false, follow: false },
};

/** Page de connexion au back-office. */
export default async function AdminLoginPage() {
  // Déjà connecté → on file au dashboard.
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-5 py-12">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5">
          <span className="font-script text-4xl text-cream-50">La Bella</span>
          <Leaf className="h-5 w-5 text-basil-400" aria-hidden />
        </span>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.4em] text-terracotta-500">
          Back-office
        </p>
      </div>

      <Suspense fallback={<div className="text-cream-200/50">Chargement…</div>}>
        <LoginForm demoVisible={isDemoVisible()} />
      </Suspense>

      <p className="mt-8 text-xs text-cream-200/40">
        Espace réservé au personnel · La Bella Pizzeria
      </p>
    </main>
  );
}
