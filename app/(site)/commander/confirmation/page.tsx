import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Hash, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { CTAButton } from "@/components/ui/CTAButton";
import { ClearCart } from "@/components/cart/ClearCart";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ConfirmationData {
  orderNumber: string;
  total: number;
  etaMinutes: number;
  paid: boolean;
  demo: boolean;
  email?: string | null;
}

/** Récupère les détails de la commande depuis Stripe ou les paramètres démo. */
async function resolveConfirmation(sp: {
  session_id?: string;
  demo?: string;
  order?: string;
  total?: string;
  eta?: string;
}): Promise<ConfirmationData | null> {
  // Mode démo (UNIQUEMENT sans Stripe configuré) : tout vient des query params.
  // En prod (clés présentes), on ignore `?demo=1` pour empêcher toute
  // confirmation « payée » forgée — seul un session_id Stripe valide compte.
  if (sp.demo === "1" && sp.order && !isStripeConfigured()) {
    return {
      orderNumber: sp.order,
      total: Number(sp.total ?? 0),
      etaMinutes: Number(sp.eta ?? 20),
      paid: true,
      demo: true,
    };
  }

  // Mode réel : on relit la session Stripe (source de vérité).
  if (sp.session_id && isStripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sp.session_id);
      return {
        orderNumber: session.metadata?.orderNumber ?? "—",
        total: (session.amount_total ?? 0) / 100,
        etaMinutes: session.metadata?.channel === "DELIVERY" ? 30 : 20,
        paid: session.payment_status === "paid",
        demo: false,
        email: session.customer_details?.email,
      };
    } catch {
      return null;
    }
  }

  return null;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const data = await resolveConfirmation(sp);

  // Aucune commande identifiable → message d'erreur.
  if (!data) {
    return (
      <section className="bg-paper py-24">
        <div className="container-page max-w-lg text-center">
          <AlertCircle className="mx-auto h-14 w-14 text-tomato-500" aria-hidden />
          <h1 className="mt-5 font-display text-3xl font-bold uppercase text-charcoal-900">
            Commande introuvable
          </h1>
          <p className="mt-3 text-charcoal-800/70">
            Nous n&apos;avons pas pu retrouver votre commande. Si vous avez été
            débité, contactez-nous et nous régulariserons immédiatement.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <CTAButton href="/commander" size="lg">Reprendre une commande</CTAButton>
            <CTAButton href="/contact" size="lg" variant="ghost" className="border border-charcoal-900/15">
              Nous contacter
            </CTAButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper py-20 lg:py-28">
      {/* Paiement réussi → on vide le panier. */}
      {data.paid && <ClearCart />}

      <div className="container-page max-w-lg">
        <div className="rounded-3xl bg-white p-8 text-center shadow-card sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-basil-500/15">
            <CheckCircle2 className="h-9 w-9 text-basil-500" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold uppercase text-charcoal-900">
            Merci pour votre commande&nbsp;!
          </h1>
          <p className="mt-2 text-charcoal-800/70">
            {data.paid
              ? "Votre paiement a bien été reçu. Nous préparons votre commande."
              : "Votre commande est enregistrée, le paiement est en cours de confirmation."}
          </p>

          {data.demo && (
            <p className="mx-auto mt-4 max-w-xs rounded-xl bg-terracotta-50 px-3 py-2 text-xs font-medium text-terracotta-700">
              Mode démo : paiement simulé (aucune carte débitée). Ajoutez vos clés
              Stripe pour activer le paiement réel.
            </p>
          )}

          <dl className="mt-8 space-y-3 rounded-2xl bg-cream-100 p-5 text-left text-sm">
            <Row icon={Hash} label="Référence" value={data.orderNumber} />
            <Row icon={CheckCircle2} label="Total payé" value={formatPrice(data.total)} />
            <Row icon={Clock} label="Temps estimé" value={`~ ${data.etaMinutes} min`} />
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton href="/" size="lg" variant="secondary" className="border border-charcoal-900/10">
              Retour à l&apos;accueil
            </CTAButton>
            <CTAButton href="/commander" size="lg">Nouvelle commande</CTAButton>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-charcoal-800/50">
          Conservez bien votre référence de commande
          {data.email ? ` — un reçu Stripe est envoyé à ${data.email}` : ""}.
        </p>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-charcoal-800/60">
        <Icon className="h-4 w-4 text-terracotta-500" aria-hidden /> {label}
      </dt>
      <dd className="font-semibold text-charcoal-900">{value}</dd>
    </div>
  );
}
