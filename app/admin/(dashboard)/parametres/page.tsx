import { Save } from "lucide-react";
import { PageHeader, Card, CardHeader, AdminButton } from "@/components/admin/ui/kit";
import { site, openingHours } from "@/data/site";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function ParametresPage() {
  return (
    <>
      <PageHeader
        title="Paramètres du restaurant"
        description="Coordonnées, fiscalité, livraison et options globales du site."
        actions={<AdminButton><Save className="h-4 w-4" /> Enregistrer</AdminButton>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Informations générales" />
          <div className="space-y-4">
            <Field label="Nom du restaurant"><input className={inputClass} defaultValue={site.fullName} /></Field>
            <Field label="Slogan"><input className={inputClass} defaultValue={site.tagline} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Devise"><input className={inputClass} defaultValue="EUR (€)" /></Field>
              <Field label="Langue"><input className={inputClass} defaultValue="Français (fr-FR)" /></Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Coordonnées" />
          <div className="space-y-4">
            <Field label="Adresse"><input className={inputClass} defaultValue={site.address.full} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Téléphone"><input className={inputClass} defaultValue={site.phone} /></Field>
              <Field label="Email"><input className={inputClass} defaultValue={site.email} /></Field>
            </div>
            <Field label="Lien Google Maps"><input className={inputClass} placeholder="https://maps.google.com/…" /></Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Commande & livraison" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="TVA (%)"><input type="number" className={inputClass} defaultValue={10} /></Field>
            <Field label="Min. commande (€)"><input type="number" className={inputClass} defaultValue={15} /></Field>
            <Field label="Frais livraison (€)"><input type="number" step="0.5" className={inputClass} defaultValue={2.5} /></Field>
            <Field label="Temps prépa (min)"><input type="number" className={inputClass} defaultValue={20} /></Field>
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <ToggleRow label="Mettre les commandes en pause" hint="Désactive temporairement la prise de commande en ligne." />
            <ToggleRow label="Assistant IA activé" hint="Active le chatbot client sur le site public." defaultOn />
          </div>
        </Card>

        <Card>
          <CardHeader title="Horaires d'ouverture" />
          <ul className="space-y-2">
            {openingHours.map((h) => (
              <li key={h.day} className="flex items-center justify-between gap-3 text-sm">
                <span className="w-24 text-slate-600">{h.day}</span>
                <input className={`${inputClass} flex-1`} defaultValue={h.hours} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Démo : formulaire non persistant. Brancher
        <code className="mx-1">PUT /api/admin/settings</code> (modèle RestaurantSetting) pour sauvegarder.
      </p>
    </>
  );
}

function ToggleRow({ label, hint, defaultOn }: { label: string; hint: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <span className={`mt-1 h-6 w-11 shrink-0 rounded-full ${defaultOn ? "bg-emerald-500" : "bg-slate-300"} relative`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${defaultOn ? "translate-x-5" : "translate-x-0.5"}`} />
      </span>
    </div>
  );
}
