import { Save, Eye } from "lucide-react";
import { PageHeader, AdminButton, Card, CardHeader } from "@/components/admin/ui/kit";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20";

const sections = [
  ["hero", "Hero (bannière principale)", true],
  ["pizzas", "Nos pizzas", true],
  ["quality", "Qualité & passion", true],
  ["menus", "Nos menus", true],
  ["delivery", "Livraison rapide", true],
  ["testimonials", "Avis clients", true],
] as const;

export default function SiteWebPage() {
  return (
    <>
      <PageHeader
        title="Contenu du site"
        description="Éditez les textes, visuels et sections affichées sur le site public."
        actions={
          <>
            <AdminButton variant="secondary" href="/"><Eye className="h-4 w-4" /> Voir le site</AdminButton>
            <AdminButton><Save className="h-4 w-4" /> Publier</AdminButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Section Hero" />
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Sur-titre</span>
              <input className={inputClass} defaultValue="Le goût" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Titre principal</span>
              <input className={inputClass} defaultValue="De l'Italie" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Sous-titre</span>
              <textarea rows={2} className={inputClass} defaultValue="Des pizzas artisanales préparées avec des ingrédients frais et de qualité, cuites au feu de bois." />
            </label>
          </div>
        </Card>

        <Card>
          <CardHeader title="Bannière promotionnelle" />
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Activer la bannière</span>
              <span className="relative h-6 w-11 rounded-full bg-slate-300">
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
              <input className={inputClass} placeholder="-15% sur votre première commande avec le code BIENVENUE10" />
            </label>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Sections de la page d'accueil" />
          <ul className="divide-y divide-slate-100">
            {sections.map(([key, label, on]) => (
              <li key={key} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-700">{label}</span>
                <span className={`relative h-6 w-11 rounded-full ${on ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Démo : édition non persistante. Brancher le modèle SiteContentBlock pour
        rendre ces blocs dynamiques côté site public.
      </p>
    </>
  );
}
