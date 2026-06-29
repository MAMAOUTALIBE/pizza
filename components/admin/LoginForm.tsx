"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/admin/login/actions";

const demoAccounts = [
  ["Super Admin", "superadmin@labella.fr"],
  ["Gérant", "manager@labella.fr"],
  ["Cuisine", "cuisine@labella.fr"],
  ["Livreur", "livreur@labella.fr"],
  ["Support", "support@labella.fr"],
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-60"
    >
      <LogIn className="h-4 w-4" aria-hidden />
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export function LoginForm({ demoVisible = false }: { demoVisible?: boolean }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <div className="w-full max-w-md">
      <form
        action={formAction}
        className="rounded-3xl border border-white/10 bg-charcoal-900/80 p-8 shadow-2xl backdrop-blur"
      >
        <input type="hidden" name="from" value={from} />

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-cream-100">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            defaultValue={demoVisible ? "superadmin@labella.fr" : undefined}
            className="w-full rounded-xl border border-white/10 bg-charcoal-950 px-4 py-3 text-sm text-cream-50 placeholder:text-cream-200/30 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
            placeholder="vous@labella.fr"
          />
        </div>

        <div className="mt-4 space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-cream-100">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue={demoVisible ? "demo" : undefined}
            className="w-full rounded-xl border border-white/10 bg-charcoal-950 px-4 py-3 text-sm text-cream-50 placeholder:text-cream-200/30 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
            placeholder="••••••••"
          />
        </div>

        {state?.error && (
          <p className="mt-4 rounded-lg bg-tomato-600/15 px-3 py-2 text-sm text-tomato-500">
            {state.error}
          </p>
        )}

        <div className="mt-6">
          <SubmitButton />
        </div>
      </form>

      {/* Comptes de démonstration — masqués en production */}
      {demoVisible && (
      <div className="mt-6 rounded-2xl border border-white/5 bg-charcoal-900/40 p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta-400">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Comptes de démonstration
        </p>
        <p className="mt-2 text-xs text-cream-200/60">
          Mot de passe pour tous&nbsp;: <code className="text-cream-100">demo</code>
        </p>
        <ul className="mt-3 grid gap-1.5 text-xs text-cream-200/75">
          {demoAccounts.map(([role, email]) => (
            <li key={email} className="flex justify-between gap-3">
              <span className="text-cream-200/55">{role}</span>
              <code className="text-cream-100">{email}</code>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}
